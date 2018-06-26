const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(dir) {
    return path.resolve(__dirname, "..", dir);
}

module.exports = {
    entry: resolve("src/main.js"),
    output: {
        path: resolve("dist"),
        filename: "[name].js"
    },
    resolve: {
        // 省略后缀
        extensions: [".js", ".vue", ".json"],
        // 匹配:require('@/test') 等同于 ./src/test.js
        alias: {
            "@": resolve("src")
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "vue-style-loader", // style-loader的一个分支，作用相似，另外添加了服务端渲染的支持
                    "css-loader"
                ]
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]?[hash]"
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve('index.html')
        })
    ],

};
