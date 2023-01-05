import 'obsidian';

import { DataviewApi } from 'obsidian-dataview';

declare module 'obsidian' {
    interface App {
        plugins: {
            enabledPlugins: Set<string>;
            plugins: {
                [id: string]: unknown;
                dataview?: {
                    api?: DataviewApi;
                };
            };
        };
    }

    interface MetadataCache {
        on(
            name: 'dataview:index-ready',
            callback: (api: DataviewApi) => unknown,
            ctx?: unknown
        ): EventRef;

        on(
            name: 'dataview:metadata-change',
            callback: (op: string, file: TFile, oldPath?: string) => unknown,
            ctx?: unknown
        ): EventRef;
    }
}