var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: '[name].build.js'
  },
  module: {
    //重要!!: loader是有先后顺序的，use:[x,y,z] 越靠后约先执行，loader: 'x!y!z' 这种写法也一样，z->y->x
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader', // style-loader的一个分支，作用相似，另外添加了服务端渲染的支持
          'css-loader'
        ],
      },{
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      // 指定require('vue')时用的哪个版本，vue包默认用的是dist/vue.runtime.common.js
      // vue.esm.js是基于ES Module，使用与webpack2。 详细看：https://www.mmxiaowu.com/article/58482558d4352863efb55475
      'vue$': 'vue/dist/vue.esm.js' 
    },
    //默认可导入的扩展名，如配置.js后，require('test.js')可简写为 require('test')
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false //是否提醒引入了一个大文件false|'error'|'warning': 不提醒|作为错误提醒|作为警告提醒
  },
  devtool: '#eval-source-map',
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([

    // 会动态把定义的变量插入到执行时代码中
    // 如，在src/中的js代码中console.log(HELLO)会出现hello world，在编译的时候webpack把代码中HELLO替换成了hello world
    // 定义的变量值 必须是 '"sentence"', 否则会报sentence undefined错误
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      },
      HELLO: '"hello world"'
    }),

    // 压缩
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    // webpack2能兼容webpack1的方法。感觉用处不大~ 
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
