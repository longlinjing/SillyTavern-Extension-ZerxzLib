import path from 'node:path';
import fs from 'node:fs';
import TerserPlugin from 'terser-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

import ChunksWebpackPlugin from 'chunks-webpack-plugin';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const __filename = url.fileURLToPath(import.meta.url);
console.log(`__dirname: ${__dirname} __filename: ${__filename}`);
const manifest = JSON.parse(fs.readFileSync('./manifest.json', 'utf8'));


const sillyTavern = __dirname.substring(0, __dirname.lastIndexOf('public') + 6);
let { js: scriptFilepath } = manifest;
scriptFilepath = path.dirname(path.join(__dirname, scriptFilepath));
console.log(`scriptFilepath: ${scriptFilepath}`);
const relativePath = path.relative(scriptFilepath, sillyTavern);
export default {
    experiments: {
        outputModule: true,
    },
    target: 'browserslist',
    entry: {
        'zerxz-lib': path.join(__dirname, 'src/index.ts'),
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist/'),
        chunkFilename: '[name].[contenthash].chunk.js',
        library: {
            // do not specify a `name` here
            type: 'module',
        },
    },
    plugins: [new ChunksWebpackPlugin({
        filename:"index.js",
        templateScript: (name, entryName) =>
            `;(function(){const script=document.createElement("script");script.setAttribute("defer","defer");script .setAttribute("src",".${scriptFilepath.replace(sillyTavern,"").replace(/\\/g, '/')}/${name}");document.body.appendChild(script)})();`,
        generateChunksManifest: true
    })],
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
        plugins: [new TsconfigPathsPlugin({ extensions: ['.ts', '.js', '.tsx', '.jsx'], baseUrl: './src/', configFile: path.join(__dirname, 'tsconfig.json') })],
        alias: {
            '@silly-tavern': path.join(__dirname, '../../../../..'),
        },
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: [
                    /node_modules/,
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: [

                            ['@babel/preset-env', {}],
                            ['@babel/preset-typescript', {}],
                            ['@babel/preset-react', { runtime: 'automatic' }],

                        ],
                    },
                },
            },

        ],
    },
    optimization: {

        minimize: true,
        minimizer: [new TerserPlugin({ extractComments: false })],
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            cacheGroups: {
                vendor: {
                    name(module) {
                        const packageName = module.context.match(
                            /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                        )[1];
                        return `${packageName.replace('@', '')}`;
                    },
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    enforce: true,
                },
                default: {
                    name: 'default',
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    externals: [({ context, request }, callback) => {
        let scriptPath = path.join(context, request);
        const basenameDir = path.basename(__dirname);
        if (/^@silly-tavern/.test(request)) {
            const script = (relativePath + '\\' + request.replace('@silly-tavern/', '')).replace(/\\/g, '/');
            return callback(null, script);
        }
        if (!scriptPath.includes(basenameDir)) {
            let isJs = path.extname(scriptPath) === '.js';
            if (!isJs) {
                isJs = fs.existsSync(scriptPath + '.js');
                scriptPath = isJs ? scriptPath + '.js' : scriptPath;
            }
            if (isJs) {
                const script = (relativePath + scriptPath.replace(sillyTavern, '')).replace(/\\/g, '/');
                return callback(null, script);
            }
        }
        console.log(`External: ${request} Context: ${context} Path: ${scriptPath}`);
        callback();
    }],
};
