'use strict'

const path = require('path')
const config = require('./config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')

exports.assetsPath = _path => {
    const assetsSubDirectory =
        process.env.NODE_ENV === 'production' ? config.build.assetsSubDirectory : config.dev.assetsSubDirectory

    return path.posix.join(assetsSubDirectory, _path) // posix全平台系统下都兼容的join方法
}

exports.cssLoaders = options => {
    options = options || {}

    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap,
        },
    }

    const postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap,
        },
    }

    // generate loader string to be used with extract text plugin
    const generateLoaders = (loader, loaderOptions) => {
        const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap,
                }),
            })
        }
 
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader',
            })
        } else {
            return ['vue-style-loader'].concat(loaders)
        }
    }

    return {
        css: generateLoaders(),
        less: generateLoaders('less'),
    }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
    const output = []
    const loaders = exports.cssLoaders(options)

    for (const extension in loaders) {
        const loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader,
        })
    }
    return output
}



// 出现报错的时候才会调用gai
exports.createNotifierCallback = () => {
    const notifier = require('node-notifier')
    return (severity, errors) => {
        if (severity !== 'error') return

        const error = errors[0]
        const filename = error.file && error.file.split('!').pop()

        notifier.notify({
            title: packageConfig.name,
            message: severity + ': ' + error.name,
            subtitle: filename || '',
            icon: path.join(__dirname, 'logo.png'),
        })
    }
}

// 获取多级的入口文件
exports.getMultiEntry = fileExt => {
    let globPath = './src/' + config.moduleName + '/**/*.' + fileExt
    const glob = require('glob')
    let entries = {},
        basename,
        tmp,
        pathname
    glob.sync(globPath).forEach(entry => {
        basename = path.basename(entry, '.'+fileExt)
        tmp = entry.split('/').splice(-4)
        let pathsrc = tmp[0] + '/' + tmp[1]
        if (tmp[0] == 'src') {
            pathsrc = tmp[1]
        }
        pathname = pathsrc + '/' + basename
        entries[pathname] = entry
    })

    // 输出形如 {'pages/home': './src/pages/home/home.html'}
    return entries
}


