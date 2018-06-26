const webpack = require("webpack");
const merge = require("webpack-merge");
const path = require("path");
const baseWebpackConfig = require("./webpack.base.conf");
const entry = baseWebpackConfig.entry;
Object.keys(entry).forEach(function(key) {
    entry[key] = entry[key].replace(".js", ".vue?entry=true");
});
module.exports = merge(baseWebpackConfig, {
    entry,
    mode: "production",
    plugins: [
        // webpack2能兼容webpack1的方法。感觉用处不大~
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]
});
