import { NormalizedPath } from "cdm/FolderModel";
import { DatabaseView } from "DatabaseView";
import { MediaExtensions } from "helpers/Constants";
import { getNormalizedPath } from "helpers/VaultManagement";
import { MarkdownRenderer, TFile } from "obsidian";
import { LOGGER } from "services/Logger";

export async function renderMarkdown(
  view: DatabaseView,
  markdownString: string,
  domElement: HTMLDivElement
): Promise<HTMLDivElement> {
  try {
    await MarkdownRenderer.renderMarkdown(
      markdownString,
      domElement,
      view.file.path,
      view
    );

    await handleEmbeds(domElement, view, 5);
    // applyCheckboxIndexes(dom);
    // findUnresolvedLinks(dom, view);
  } catch (e) {
    LOGGER.error(e);
  }

  return domElement;
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
        //return handleAudio(el, target, view);
      }

      if (MediaExtensions.VIDEO.contains(target.extension)) {
        //return handleVideo(el, target, view);
      }

      //   if (target.extension === "md") {
      //     return await handleMarkdown(el, target, normalizedPath, view, depth);
      //   }

      //return handleUnknownFile(el, target);
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
