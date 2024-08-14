const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    devtool: "inline-source-map",
    entry: path.join(__dirname, 'src/index.ts'),
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: `index.js`,
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js/,
                exclude: /node_modules/,
                options: {
                    cacheDirectory: true,
                    presets: [
                        '@babel/preset-env',
                        ['@babel/preset-react', { runtime: 'automatic' }],
                    ],
                },
                loader: 'babel-loader',
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    },
};
