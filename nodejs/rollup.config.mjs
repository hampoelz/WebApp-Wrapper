import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/main.ts',
    output: {
        file: '../dist/nodejs/index.js',
        format: 'cjs',
    },
    external: ['bridge'],
    plugins: [
        json(),
        typescript(),
        nodeResolve({
            preferBuiltins: true,
        }),
    ],
};
