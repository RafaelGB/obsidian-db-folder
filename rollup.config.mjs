import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript2 from "rollup-plugin-typescript2";
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

const isProd = (process.env.BUILD === 'production');
console.log(`Building ${isProd ? 'production' : 'development'}`);
const BASE_CONFIG = {
    input: "src/main.ts",
    external: ["obsidian","obsidian-dataview/lib/data-model/value"],
    onwarn: (warning, warn) => {
        // Sorry rollup, but we're using eval...
        if (/Use of eval is strongly discouraged/.test(warning.message)) return;
        warn(warning);
    },
};

const getRollupPlugins = (tsconfig, ...plugins) =>
    [
        typescript2(tsconfig),
        nodeResolve({ browser: true }),
        json(),
        commonjs(),
        // This is needed to make work the plugin on mobile
        replace({
            'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
            preventAssignment: true,
        })
    ].concat(plugins);

const PROD_PLUGIN_CONFIG = {
    ...BASE_CONFIG,
    output: {
        dir: 'dist',
        sourcemap: 'inline',
        sourcemapExcludeSources: isProd,
        format: "cjs",
        exports: "default",
        name: "Database Folder (Production)",
    },
    plugins: [
        ...getRollupPlugins()
        ,terser({
            ecma: 2021,
            mangle: { toplevel: true },
            compress: {
                module: true,
                toplevel: true,
                unsafe_arrows: true,
                drop_console: true,
                drop_debugger: true
            }
        })
    ],
};

const DEV_PLUGIN_CONFIG = {
    ...BASE_CONFIG,
    output: {
        dir: 'dist',
        sourcemap: 'inline',
        sourcemapExcludeSources: isProd,
        format: "cjs",
        exports: "default",
        name: "Database Folder (Production)",
    },
    plugins: getRollupPlugins(),
};
let configs = [];
configs.push(isProd ? PROD_PLUGIN_CONFIG : DEV_PLUGIN_CONFIG);

export default configs;