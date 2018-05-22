const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');


module.exports = {
    entry: ['babel-polyfill', 'whatwg-fetch', './Scripts/es6plus.js'],
    output: {
        path: path.resolve(__dirname, 'wwwroot', 'dist'),
        filename: 'build.js',
    },

    resolve: {
        extensions: [".js"],
    },

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
                "babel-loader",
                "eslint-loader"
            ]
        }]
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
    ],

    watch: true,
    devtool: "source-map"
};