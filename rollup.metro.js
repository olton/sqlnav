import {nodeResolve} from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from "autoprefixer"
import progress from 'rollup-plugin-progress';

const production = !(process.env.ROLLUP_WATCH),
    sourcemap = !production

const banner = ``

const targetDir = `./src/public`

export default [
    {
        input: './src/client_app/js/metro.js',
        watch: {
            clearScreen: false,
        },
        plugins: [
            progress({clearLine: true}),
            nodeResolve({browser: true}),
            postcss({
                extract: `css/metro.css`,
                minimize: true,
                use: ['less'],
                sourceMap: false,
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
            name: "metro",
            plugins: [
                terser({
                    keep_classnames: true,
                    keep_fnames: true
                })
            ]
        }
    },
]