import { DatabaseView } from "DatabaseView";
import { MediaExtensions } from "helpers/Constants";
import { c } from "helpers/StylesHelper";
import { getNormalizedPath } from "helpers/VaultManagement";
import { MarkdownRenderer, MarkdownPreviewView, TFile } from "obsidian";
import { CellContext } from "@tanstack/react-table";
import { LOGGER } from "services/Logger";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { Literal } from "obsidian-dataview";

export async function renderMarkdown(
  defaultCell: CellContext<RowDataType, Literal>,
  markdownString: string,
  domElement: HTMLDivElement,
  depth: number
) {
  try {
    const { table } = defaultCell;
    const view: DatabaseView = table.options.meta.view;
    const column = defaultCell.column.columnDef as TableColumn;
    const { media_height, media_width, enable_media_view } = column.config;
    if (isValidHttpUrl(markdownString)) {
      const media_inclusion = enable_media_view ? `|${media_height}x${media_width}` : "";

      const linkname = column.config.link_alias_enabled ?
        column.config.custom_link_alias ? column.config.custom_link_alias : `${column.label}`
        : `${markdownString}`;

      markdownString = `[${linkname}${media_inclusion}](${markdownString})`;
      if (enable_media_view) {
        markdownString = `!${markdownString}`;
      }
    }
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
    if (
      markdownString &&
      markdownString.startsWith("![[") &&
      markdownString.endsWith("]]")
    ) {
      MarkdownPreviewView.renderMarkdown(
        markdownString,
        dom.createDiv(),
        view.file.path,
        view
      );
    } else {
      await MarkdownRenderer.renderMarkdown(
        markdownString,
        dom.createDiv(),
        view.file.path,
        view
      );
    }
    domElement.addClass("is-loaded");
    if (depth > 0) {
      await handleEmbeds(dom, view, --depth);
    }
  } catch (e) {
    LOGGER.error(e);
  }
}

function handleEmbeds(dom: HTMLDivElement, view: DatabaseView, depth: number) {
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
        return handleImage(el, target, view);
      }

      if (MediaExtensions.AUDIO.contains(target.extension)) {
        return handleAudio(el, target, view);
      }

      if (MediaExtensions.VIDEO.contains(target.extension)) {
        return handleVideo(el, target, view);
      }
    })
  );
}

function handleImage(el: HTMLElement, file: TFile, view: DatabaseView) {
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

function handleAudio(el: HTMLElement, file: TFile, view: DatabaseView) {
  el.empty();
  el.createEl("audio", {
    attr: { controls: "", src: view.app.vault.getResourcePath(file) },
  });
  el.addClasses(["media-embed", "is-loaded"]);
}

function handleVideo(el: HTMLElement, file: TFile, view: DatabaseView) {
  el.empty();

  el.createEl(
    "video",
    { attr: { controls: "", src: view.app.vault.getResourcePath(file) } },
    (video) => {
      const handleLoad = () => {
        video.removeEventListener("loadedmetadata", handleLoad);

        if (video.videoWidth === 0 && video.videoHeight === 0) {
          el.empty();
          handleAudio(el, file, view);
        }
      };

      video.addEventListener("loadedmetadata", handleLoad);
    }
  );

  el.addClasses(["media-embed", "is-loaded"]);
}

function isValidHttpUrl(urlCandidate: string) {
  let url;

  try {
    url = new URL(urlCandidate);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
