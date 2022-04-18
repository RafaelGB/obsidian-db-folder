import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const isProd = (process.env.BUILD === 'production');

export default (commandLineArgs) => ({
    input: 'src/main.ts',
    output: {
        dir: 'dist',
        sourcemap: 'inline',
        sourcemapExcludeSources: isProd,
        format: 'cjs',
        exports: 'default',
    },
    external: ['obsidian'],
  plugins: [
    typescript(),
    nodeResolve({browser: true}),
    commonjs(),
    json(),
  ]
  });