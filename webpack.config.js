
// import path from 'node:path';
// import TerserPlugin from 'terser-webpack-plugin';
// import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
// import { fileURLToPath } from 'node:url';
// import ESLintWebpackPlugin from 'eslint-webpack-plugin';
const path = require('node:path');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
// const __dirname = path.dirname(__filename); // get the name of the directory
module.exports = {
    experiments: {
        outputModule: true,
    },
    target: 'browserslist',
    entry: {
        index: path.join(__dirname, 'src/index.ts'),
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist/'),
        chunkFilename: '[name].chunk.js',
        library: {
            // do not specify a `name` here
            type: 'module',
        },
    },

    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
        plugins: [new TsconfigPathsPlugin({ extensions: ['.ts', '.js', '.tsx', '.jsx'], baseUrl: path.join(__dirname, 'src/'), configFile: path.join(__dirname, 'tsconfig.json') })],
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
    },
    externals: [(context, request, callback) => {
        if (/^@silly-tavern/.test(request)) {
            return callback(null, `../../../../../${request.replace('@silly-tavern/', '')}`);
        }
        const dir = path.join(context, request);
        const basenameDir = path.basename(__dirname);
        if (!dir.includes(basenameDir)) {
            console.log(`${dir} ${__dirname}`);
            const script = ('..\\' + path.relative(context, dir) + '\\' + path.basename(request) + '.js').replace(/\\/g, '/');
            console.log(`${script}`);
            return callback(null, script);
        }
        callback();
    }],
};
