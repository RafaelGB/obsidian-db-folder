import { DatabaseView } from "DatabaseView";
import { DatabaseCore } from "helpers/Constants";
import { getNormalizedPath } from "helpers/VaultManagement";
import { useCallback } from "react";
import StateManager from "StateManager";

export function obsidianMdLinksOnClickCallback(stateManager: StateManager, view: DatabaseView, filePath: string) {
    return useCallback(
        async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.type === 'auxclick' || e.button === 2) {
                return;
            }

            const targetEl = e.target as HTMLElement;
            const closestAnchor =
                targetEl.tagName === 'A' ? targetEl : targetEl.closest('a');

            if (!closestAnchor) return;

            if (closestAnchor.hasClass('file-link')) {
                e.preventDefault();
                const href = closestAnchor.getAttribute('href');
                const normalizedPath = getNormalizedPath(href);
                const target =
                    typeof href === 'string' &&
                    app.metadataCache.getFirstLinkpathDest(
                        normalizedPath.root,
                        view.file.path
                    );

                if (!target) return;

                (app as any).openWithDefaultApp(target.path);

                return;
            }

            // Open an internal link in a new pane
            if (closestAnchor.hasClass('internal-link')) {
                e.preventDefault();
                const destination = closestAnchor.getAttr('href');
                const inNewLeaf = e.button === 1 || e.ctrlKey || e.metaKey;

                app.workspace.openLinkText(
                    destination,
                    filePath,
                    inNewLeaf
                );

                return;
            }

            // Open a tag search
            if (closestAnchor.hasClass('tag')) {
                e.preventDefault();
                (app as any).internalPlugins
                    .getPluginById('global-search')
                    .instance.openGlobalSearch(`tag:${closestAnchor.getAttr('href')}`);

                return;
            }

            // Open external link
            if (closestAnchor.hasClass('external-link')) {
                e.preventDefault();
                window.open(closestAnchor.getAttr('href'), '_blank');
            }
        },
        [stateManager, filePath]
    );
}

export function obsidianMdLinksOnMouseOverMenuCallback(view: DatabaseView) {
    return useCallback(
        async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const targetEl = e.target as HTMLElement;
            if (targetEl.tagName !== "A" || !view) return;

            if (targetEl.hasClass("internal-link")) {
                app.workspace.trigger("hover-link", {
                    event: e.nativeEvent,
                    source: DatabaseCore.FRONTMATTER_KEY,
                    hoverParent: view,
                    targetEl,
                    linktext: targetEl.getAttr("href"),
                    sourcePath: view.file.path,
                });
            }
        },
        [view]
    );
}