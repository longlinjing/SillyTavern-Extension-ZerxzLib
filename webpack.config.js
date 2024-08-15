/* eslint-disable @typescript-eslint/no-var-requires */
//
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
    devtool: 'inline-source-map',
    target: 'browserslist',
    entry: path.join(__dirname, 'src/index.ts'),
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: 'index.js',
        library: {
            // do not specify a `name` here
            type: 'module',
        },
    },

    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [new TsconfigPathsPlugin({ extensions: ['.ts', '.js', '.tsx'], baseUrl: path.join(__dirname, 'src/'), configFile: path.join(__dirname, 'tsconfig.json') })],
        alias: {
            '@silly-tavern': path.join(__dirname, '../../../../..'),
        },
    },
    module: {
        // noParse:/.js/,
        rules: [
            // {
            //     test: /\.ts$/,
            //     exclude: [
            //         /node_modules/,
            //     ],
            //     use: {
            //         loader: 'esbuild-loader',
            //         options: {
            //             loader: 'default',
            //             target: 'es2015',
            //             format:"esm"
            //         },
            //     },
            // }
            {
                test: /\.ts$/,
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
        console.log(`context: ${context} request: ${request}`);
        if (/^@silly-tavern/.test(request)) {
            return callback(null, `../../../../../${request.replace('@silly-tavern/', '')}`);
        }
        callback();
    }],
};
