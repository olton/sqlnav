import {nodeResolve} from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from "autoprefixer"
import progress from 'rollup-plugin-progress';

const production = !(process.env.ROLLUP_WATCH),
    sourcemap = !production

const banner = `
/*!
 * SQL Navigator (https://sqlnav.com)
 * Copyright ${new Date().getFullYear()} by Serhii Pimenov
 * Licensed under GPLv3
 !*/
`

const targetDir = `./src/public`

export default [
    {
        input: './src/client_app/js/index.js',
        watch: {
            clearScreen: false,
        },
        plugins: [
            progress({clearLine: true}),
            nodeResolve({browser: true}),
            postcss({
                extract: `css/index.css`,
                minimize: false,
                use: ['less'],
                sourceMap: sourcemap,
                plugins: [
                    autoprefixer(),
                ]
            }),
        ],
        output: {
            dir: targetDir,
            entryFileNames: `js/[name].js`,
            format: 'iife',
            sourcemap: sourcemap,
            banner,
            name: "sqlnav",
            plugins: [
                production && terser({
                    keep_classnames: true,
                    keep_fnames: true
                })
            ]
        }
    },
]