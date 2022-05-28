import { DatabaseCore } from "helpers/Constants";
import DBFolderPlugin from "main";
import { MarkdownPostProcessorContext } from "obsidian";



/**
 * Keep info about a note and offer methods to manipulate it
 */
export class PreviewDatabaseModeService {
    private static instance: PreviewDatabaseModeService;
    private plugin: DBFolderPlugin;
    constructor(plugin: DBFolderPlugin) {
        this.plugin = plugin;
        if (!PreviewDatabaseModeService.instance) {
            PreviewDatabaseModeService.instance = this;
        }
    }
    hoverEvent = (e: any) => {
        if (!e.linktext) {
            this.plugin.hover.linkText = null;
            return;
        }
        this.plugin.hover.linkText = e.linktext;
        this.plugin.hover.sourcePath = e.sourcePath;
    };
    /**
 *
 * @param el
 * @param ctx
 */
    markdownPostProcessor = async (
        el: HTMLElement,
        ctx: MarkdownPostProcessorContext,
    ) => {
        //check to see if we are rendering in editing mode of live preview
        //if yes, then there should be no .internal-embed containers
        const embeddedItems = el.querySelectorAll(".internal-embed");
        if (embeddedItems.length === 0) {
            this.tmpObsidianWYSIWYG(el, ctx);
            return;
        }

        //If the file being processed is an excalidraw file,
        //then I want to hide all embedded items as these will be
        //transcluded text element or some other transcluded content inside the Excalidraw file
        //in reading mode these elements should be hidden
        if (ctx.frontmatter?.hasOwnProperty(DatabaseCore.FRONTMATTER_KEY)) {
            el.style.display = "none";
            return;
        }
    };

    tmpObsidianWYSIWYG = async (
        el: HTMLElement,
        ctx: MarkdownPostProcessorContext,
    ) => {
        if (!ctx.frontmatter) {
            return;
        }
        if (!ctx.frontmatter.hasOwnProperty(DatabaseCore.FRONTMATTER_KEY)) {
            return;
        }
        //@ts-ignore
        if (ctx.remainingNestLevel < 4) {
            return;
        }
        if (!el.querySelector(".frontmatter")) {
            el.style.display = "none";
            return;
        }
        el.empty();

        const div = createDiv();
        div.textContent = "Random Text";
        el.appendChild(div);
        setTimeout(async () => {
            let internalEmbedDiv: HTMLElement = div;
            while (
                !internalEmbedDiv.hasClass("internal-embed") &&
                internalEmbedDiv.parentElement
            ) {
                internalEmbedDiv = internalEmbedDiv.parentElement;
            }

            if (!internalEmbedDiv.hasClass("internal-embed")) {
                el.empty();
                el.appendChild(div);
                return;
            }

            internalEmbedDiv.empty();

            //timer to avoid the image flickering when the user is typing
            let timer: NodeJS.Timeout = null;
            const observer = new MutationObserver((m) => {
                if (!["alt", "width", "height"].contains(m[0]?.attributeName)) {
                    return;
                }
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(() => {
                    timer = null;
                    internalEmbedDiv.empty();
                }, 500);
            });
            observer.observe(internalEmbedDiv, {
                attributes: true, //configure it to listen to attribute changes
            });
        }, 300);
    };

    public static getInstance(plugin?: DBFolderPlugin): PreviewDatabaseModeService {
        if (!this.instance) {
            this.instance = new PreviewDatabaseModeService(plugin);
        }
        return this.instance;
    }
}