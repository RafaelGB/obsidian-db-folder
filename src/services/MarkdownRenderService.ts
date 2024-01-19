import { CellContext } from "@tanstack/react-table";
import { NormalizedPath, RowDataType, TableColumn } from "cdm/FolderModel";
import { MediaExtensions, SUGGESTER_REGEX } from "helpers/Constants";
import { c } from "helpers/StylesHelper";
import { getNormalizedPath } from "helpers/VaultManagement";
import { CachedMetadata, MarkdownRenderer, setIcon, TFile } from "obsidian";
import { Literal } from "obsidian-dataview";
import { LOGGER } from "services/Logger";
import { CustomView } from "views/AbstractView";

const ILLIGAL_CHARS = /[!"#$%&()*+,.:;<=>?@^`{|}~/[\]\\]/g;
class MarkdownRenderService {
    private static instance: MarkdownRenderService;
    public async renderMarkdown(
        defaultCell: CellContext<RowDataType, Literal>,
        markdownString: string,
        domElement: HTMLDivElement,
        depth: number,
        array =true,
    ) {
        try {
            const { table } = defaultCell;
            const view = table.options.meta.view;
            const column = defaultCell.column.columnDef as TableColumn;
            const { media_height, media_width, enable_media_view } = column.config;
            // URL modifiers
            if (this.isValidHttpUrl(markdownString)) {
                const media_inclusion = enable_media_view ? `|${media_height}x${media_width}` : "";

                const linkname = column.config.link_alias_enabled ?
                    column.config.custom_link_alias ? column.config.custom_link_alias : `${column.label}`
                    : `${markdownString}`;

                markdownString = `[${linkname}${media_inclusion}](${markdownString})`;
                if (enable_media_view) {
                    markdownString = `!${markdownString}`;
                }
            }
            // Array modifiers
            if (array && SUGGESTER_REGEX.TEXT_ARRAY.test(markdownString)) {
                let alternativeString = "";
                markdownString
                    .replaceAll(SUGGESTER_REGEX.TEXT_ARRAY, "$2$3$4")
                    .split(",")
                    .forEach((item) => {
                        alternativeString = alternativeString.concat(`- ${item.trim()}\n`);
                    });
                markdownString = alternativeString;
            }
            await this.renderStringAsMarkdown(
                view,
                markdownString,
                domElement,
                depth,
            );
        } catch (e) {
            LOGGER.error(e);
        }
    }

    /**
     * Generic function to render a string as markdown
     * @param table 
     * @param markdownString 
     * @param domElement 
     * @param depth 
     * @param mdMode 
     */
    public async renderStringAsMarkdown(
        view: CustomView,
        markdownString: string,
        domElement: HTMLDivElement,
        depth: number) {

        domElement.empty();
        const dom = domElement.createDiv();

        dom.addClasses(["markdown-preview-view", c("markdown-preview-view")]);
        dom.createDiv(c("embed-link-wrapper"), (wrapper) => {
            wrapper.createEl(
                "a",
                {
                    href: domElement.getAttr("src") || view.file.basename,
                    cls: `internal-link ${c("embed-link")}`,
                },
                (link) => {
                    link.setAttr("aria-label", view.file.basename);
                }
            );
        });

        await MarkdownRenderer.renderMarkdown(
            markdownString,
            dom.createDiv(),
            view.file.path,
            view
        );

        this.applyCheckboxIndexes(dom);
        this.findUnresolvedLinks(dom, view);

        domElement.addClass("is-loaded");
        if (depth > 0) {
            await this.handleEmbeds(dom, view, --depth);
        }
    }

    /**
     * Handle embeds files in markdown recursively
     * @param dom 
     * @param view 
     * @param depth 
     * @returns 
     */
    private handleEmbeds(dom: HTMLDivElement, view: CustomView, depth: number) {
        return Promise.all(
            dom.findAll(".internal-embed").map(async (el) => {
                const src = el.getAttribute("src");
                const normalizedPath = getNormalizedPath(src);
                const target =
                    typeof src === "string" &&
                    view.app.metadataCache.getFirstLinkpathDest(
                        normalizedPath.root,
                        view.file.path
                    );

                if (!(target instanceof TFile)) {
                    return;
                }

                if (MediaExtensions.IMAGE.contains(target.extension)) {
                    return this.handleImage(el, target, view);
                }

                if (MediaExtensions.AUDIO.contains(target.extension)) {
                    return this.handleAudio(el, target, view);
                }

                if (MediaExtensions.VIDEO.contains(target.extension)) {
                    return this.handleVideo(el, target, view);
                }

                if (target.extension === 'md') {
                    return await this.handleMarkdown(el, target, normalizedPath, view, depth);
                }

                return this.handleUnknownFile(el, target);

            })
        );
    }

    /**************************************************************************
     *                         EMBED FILE HANDLERS
    **************************************************************************/

    /**
     * Handle non controlled file types
     * @param el 
     * @param file 
     */
    private handleUnknownFile(el: HTMLElement, file: TFile) {
        el.addClass('is-loaded');
        el.empty();
        el.createEl(
            'a',
            {
                cls: 'file-link',
                href: el.getAttribute('src'),
                text: file.name,
            },
            (a) => {
                a.setAttribute('aria-label', 'Open in default app');
                a.createSpan({}, (span) => setIcon(span, 'lucide-arrow-up-right'));
            }
        );
    }

    /**
     * Handle image embed files
     * @param el 
     * @param file 
     * @param view 
     */
    private handleImage(el: HTMLElement, file: TFile, view: CustomView) {
        el.empty();

        el.createEl(
            "img",
            { attr: { src: view.app.vault.getResourcePath(file) } },
            (img) => {
                if (el.hasAttribute("width")) {
                    img.setAttribute("width", el.getAttribute("width"));
                }

                if (el.hasAttribute("height")) {
                    img.setAttribute("height", el.getAttribute("height"));
                }

                if (el.hasAttribute("alt")) {
                    img.setAttribute("alt", el.getAttribute("alt"));
                }
            }
        );

        el.addClasses(["image-embed", "is-loaded"]);
    }

    /**
     * Handle audio embed files
     * @param el 
     * @param file 
     * @param view 
     */
    private handleAudio(el: HTMLElement, file: TFile, view: CustomView) {
        el.empty();
        el.createEl("audio", {
            attr: { controls: "", src: view.app.vault.getResourcePath(file) },
        });
        el.addClasses(["media-embed", "is-loaded"]);
    }

    /**
     * Handle video embed files
     * @param el 
     * @param file 
     * @param view 
     */
    private handleVideo(el: HTMLElement, file: TFile, view: CustomView) {
        el.empty();

        el.createEl(
            "video",
            { attr: { controls: "", src: view.app.vault.getResourcePath(file) } },
            (video) => {
                const handleLoad = () => {
                    video.removeEventListener("loadedmetadata", handleLoad);

                    if (video.videoWidth === 0 && video.videoHeight === 0) {
                        el.empty();
                        this.handleAudio(el, file, view);
                    }
                };

                video.addEventListener("loadedmetadata", handleLoad);
            }
        );

        el.addClasses(["media-embed", "is-loaded"]);
    }

    /**
     * Handle markdown embed files
     * @param el 
     * @param file 
     * @param normalizedPath 
     * @param view 
     * @param depth 
     * @returns 
     */
    public async handleMarkdown(
        el: HTMLElement,
        file: TFile,
        normalizedPath: NormalizedPath,
        view: CustomView,
        depth: number
    ) {
        const { markdown, boundary } = await this.getEmbeddedMarkdownString(
            file,
            normalizedPath,
            view
        );

        if (!markdown) return;

        el.empty();
        const dom = el.createDiv();

        dom.addClasses(['markdown-preview-view', c('markdown-preview-view')]);
        dom.createDiv(c('embed-link-wrapper'), (wrapper) => {
            wrapper.createEl(
                'a',
                {
                    href: el.getAttr('src') || file.basename,
                    cls: `internal-link ${c('embed-link')}`,
                },
                (link) => {
                    setIcon(link, 'link');
                    link.setAttr('aria-label', file.basename);
                }
            );
        });

        await MarkdownRenderer.renderMarkdown(
            markdown,
            dom.createDiv(),
            file.path,
            view
        );

        el.addClass('is-loaded');

        const listItems = el.findAll('.task-list-item-checkbox');

        if (listItems?.length) {
            const fileCache = app.metadataCache.getFileCache(file);

            fileCache.listItems
                ?.filter((li) => {
                    if (!boundary) return true;
                    return (
                        li.position.start.line >= boundary.startLine &&
                        li.position.end.line <= boundary.endLine
                    );
                })
                .forEach((li, i) => {
                    if (listItems[i]) {
                        listItems[i].dataset.oStart = li.position.start.offset.toString();
                        listItems[i].dataset.oEnd = li.position.end.offset.toString();
                        listItems[i].dataset.src = file.path;
                    }
                });
        }

        if (depth > 0) {
            await this.handleEmbeds(dom, view, --depth);
        }
    }
    /**************************************************************************
     *                        HELPERS AND UTILS
    **************************************************************************/
    private async getEmbeddedMarkdownString(
        file: TFile,
        normalizedPath: NormalizedPath,
        view: CustomView
    ) {
        const fileCache = view.app.metadataCache.getFileCache(file);

        if (!fileCache) {
            return null;
        }

        const content = await view.app.vault.cachedRead(file);

        if (!normalizedPath.subpath) {
            return { markdown: content, boundary: null };
        }

        const contentBoundary = this.getSubpathBoundary(fileCache, normalizedPath.subpath);

        if (contentBoundary) {
            return {
                markdown: content.substring(
                    contentBoundary.start,
                    contentBoundary.end === null ? undefined : contentBoundary.end
                ),
                boundary: contentBoundary,
            };
        } else if (normalizedPath.subpath) {
            return {
                markdown: `'Unable to find' ${normalizedPath.root}${normalizedPath.subpath
                    }`,
                boundary: null,
            };
        }
    }

    private getSubpathBoundary(fileCache: CachedMetadata, subpath: string) {
        if (!fileCache || !subpath) return null;

        const pathArr = subpath.split('#').filter((e) => {
            return !!e;
        });

        if (!pathArr || 0 === pathArr.length) return null;

        if (pathArr.length === 1) {
            const firstSegment = pathArr[0];

            if (firstSegment.startsWith('^')) {
                const blockId = firstSegment.slice(1).toLowerCase();
                const blockCache = fileCache.blocks;

                if (blockCache && blockCache[blockId]) {
                    const block = blockCache[blockId];

                    return {
                        type: 'block',
                        block,
                        start: block.position.start.offset,
                        end: block.position.end.offset,
                        startLine: block.position.start.line,
                        endLine: block.position.end.line,
                    };
                } else {
                    return null;
                }
            }
        }

        const headingCache = fileCache.headings;
        if (!headingCache || 0 === headingCache.length) return null;

        let l = 0,
            p = 0,
            targetHeadingLevel = 0,
            targetHeading = null,
            nextHeading = null;

        for (; p < headingCache.length; p++) {
            const currentHeading = headingCache[p];

            if (targetHeading && currentHeading.level <= targetHeadingLevel) {
                nextHeading = currentHeading;
                break;
            }

            if (
                !targetHeading &&
                currentHeading.level > targetHeadingLevel &&
                this.sanitize(currentHeading.heading).toLowerCase() ===
                this.sanitize(pathArr[l]).toLowerCase()
            ) {
                l++;
                targetHeadingLevel = currentHeading.level;
                if (l === pathArr.length) {
                    targetHeading = currentHeading;
                }
            }
        }

        return targetHeading
            ? {
                type: 'heading',
                current: targetHeading,
                next: nextHeading,
                start: targetHeading.position.start.offset,
                end: nextHeading ? nextHeading.position.start.offset : null,
                startLine: targetHeading.position.start.line,
                endLine: nextHeading ? nextHeading.position.end.line : null,
            }
            : null;
    }
    /**
     * Check if a string is a valid URL
     * @param urlCandidate 
     * @returns 
     */
    private isValidHttpUrl(urlCandidate: string) {
        let url;

        try {
            url = new URL(urlCandidate);
        } catch (_) {
            return false;
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }

    /**
     * Manage md encoding
     * @param e 
     * @returns 
     */
    private sanitize(e: string) {
        return e.replace(ILLIGAL_CHARS, ' ').replace(/\s+/g, ' ').trim();
    }

    /**
     * Asocciate link and index to checkboxes
     * @param dom 
     */
    private applyCheckboxIndexes(dom: HTMLElement) {
        const checkboxes = dom.querySelectorAll('.task-list-item-checkbox');

        checkboxes.forEach((el, i) => {
            (el as HTMLElement).dataset.checkboxIndex = i.toString();
        });
    }

    /**
     * Manage unresolved links adding a class
     * @param dom 
     * @param view 
     */
    private findUnresolvedLinks(dom: HTMLDivElement, view: CustomView) {
        const links = dom.querySelectorAll('.internal-link');

        links.forEach((link) => {
            const path = getNormalizedPath(link.getAttr('href'));
            const dest = view.app.metadataCache.getFirstLinkpathDest(
                path.root,
                view.file.path
            );

            if (!dest) {
                link.addClass('is-unresolved');
            }
        });
    }

    /**
     * Singleton instance
     * @returns { MarkdownRenderService}
     */
    public static getInstance(): MarkdownRenderService {
        if (!this.instance) {
            this.instance = new MarkdownRenderService();
        }
        return this.instance;
    }
}

export const MarkdownService = MarkdownRenderService.getInstance();
