'use strict'

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const utils = require('./utils')
const config = require('./config')
const baseWebpackConfig = require('./webpack.base.conf')

const htmlWebpackPlugins = () => {
    const arr = []
    const pages = utils.getMultiEntry('html')
    for (const pathname in pages) {
        // 配置生成的html文件，定义路径等
        const conf = {
            filename: pathname + '.html',
            template: pages[pathname], // 模板路径
            chunks: [pathname], // 每个html引用的js模块
            inject: true, // js插入位置
        }
        // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
        arr.push(new HtmlWebpackPlugin(conf))
    }
    return arr
}

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    module: {
        // 合并base文件的webpack配置
        rules: utils.styleLoaders({
            sourceMap: config.dev.cssSourceMap,
            usePostCSS: true,
        }),
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,

    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [{ from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') }],
        },
        hot: true,
        inline: true,
        progress: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true,
        host: config.dev.host,
        port: config.dev.port,
        open: config.dev.autoOpenBrowser,
        // openPage: 'pages/*.html',  // 自动打开页面时选择打开页面

        // { warnings: false, errors: true } 不显示警告，只显示错误 : false 都不显示
        overlay: config.dev.errorOverlay ? { warnings: false, errors: true } : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        // 关掉webpack输出到控制台的log
        quiet: true,
        // poll: true | false | 10000
        // 在某些情况下监听文件变动可能会无效，这时候用轮询的方式查看文件变化。
        // true开启轮询，false不轮询， 10000设置轮询时间
        watchOptions: { poll: config.dev.poll },
    },
    plugins: [
        // 定义环境变量
        new webpack.DefinePlugin({
            'process.env': config.dev.env,
        }),
        // 模块热替换
        new webpack.HotModuleReplacementPlugin(),

        // 模块热替换的时候在console中显示模块的文件名，而不是id
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        ...htmlWebpackPlugins(),
    ],
})

// const openPages = Object.keys(utils.getMultiEntry('js')).map(e => e + '.html')
// 自动检索下一个可用端口

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
            // add port to devServer config
            devWebpackConfig.devServer.port = port
            let arrMessages = Object.keys(utils.getMultiEntry('html')).map(
                e => `点击打开页面: http://${devWebpackConfig.devServer.host}:${port}${config.dev.assetsPublicPath}/${e}.html\n`
            )
            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(
                new FriendlyErrorsPlugin({
                    compilationSuccessInfo: {
                        messages: arrMessages,
                    },
                    onErrors: config.dev.notifyOnErrors ? utils.createNotifierCallback() : undefined,
                })
            )
            resolve(devWebpackConfig)
        }
    })
})
