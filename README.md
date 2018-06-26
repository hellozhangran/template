# Webpack Simple Template

 *一个注释详细到令人发指的webpack vue脚手架*

## Feature
1. 首先是一个简单的vue项目的脚手架
2. 重点不在vue，而是在webpack的配置，vue部分只配`vue-loader`。
3. 升级webpack 4.+
4. 最重要的是本项目的所有文件、配置都有详细的说明，希望做为一个脚手架的同时也能发挥webpack配置说明书的作用。


## 部分解释

package-lock.json作用： npm install后自动生成，详细描写了package.json中的包版本，是具体版本号，不是范围版本号。防止防范了范围版本号下，包作者升级版本后自动下载的问题。


输出文件的目录结构整理
file-loader输出图片资源的目录配置

### 升级Webpack4 需要做的 

1. 单独安装一个`webpack-cli`包，从4开始webpack的命令行工具从webpack项目中拆出来了，要使用webpack命令需要单独装`webpack-cli` 

2. `vue-loader`除了写在module.rules中还需要再插件中配置，如下
    ```javascript
    // 先得到相关模块
    const { VueLoaderPlugin } = require('vue-loader')

    // 写到plugins中
    plugins: [
        new VueLoaderPlugin()
    ]
    ```
3. 阿斯蒂芬


## 参考

> [Webpack 4 不完全迁移指北](https://github.com/dwqs/blog/issues/60)

> [stage-n 各版本区别](https://www.vanadis.cn/2017/03/18/babel-stage-x)

> [babel-preset-env](https://juejin.im/entry/59c4f9dd6fb9a00a4c271167)

> [package.json部分解释](https://github.com/yangbo5207/qqmusic/wiki/%E9%A1%B9%E7%9B%AE%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6package.json%E9%87%8C%E4%BE%9D%E8%B5%96%E7%BB%84%E4%BB%B6%E7%9A%84%E7%AE%80%E4%BB%8B)


