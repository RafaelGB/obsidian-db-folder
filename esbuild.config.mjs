import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";

const banner =
`/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = (process.argv[2] === "production");

const context = await esbuild.context({
	banner: {
		js: banner,
	},
	entryPoints: ["src/main.ts"],
	bundle: true,
	external: [
      "obsidian",
      "electron",
      "@codemirror/autocomplete",
      "@codemirror/closebrackets",
      "@codemirror/collab",
      "@codemirror/commands",
      "@codemirror/comment",
      "@codemirror/fold",
      "@codemirror/gutter",
      "@codemirror/highlight",
      "@codemirror/history",
      "@codemirror/language",
      "@codemirror/lint",
      "@codemirror/matchbrackets",
      "@codemirror/panel",
      "@codemirror/rangeset",
      "@codemirror/rectangular-selection",
      "@codemirror/search",
      "@codemirror/state",
      "@codemirror/stream-parser",
      "@codemirror/text",
      "@codemirror/tooltip",
      "@codemirror/view",
      "@codemirror/basic-setup",
      "@lezer/common",
      "@lezer/highlight",
      "@lezer/lr",
      ...builtins,
    ],
	format: "cjs",
	target: "ES6",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	minify: prod ? true : false,
	treeShaking: true,
	outfile: "dist/main.js",
	loader: {
        ".ttf": "file",
    },
});

if (prod) {
	await context.rebuild();
	process.exit(0);
} else {
	await context.watch();
}