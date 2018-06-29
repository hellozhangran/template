[
    {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
            loaders: [Object],
            cssSourceMap: true,
            cacheBusting: true,
            transformToRequire: [Object]
        }
    },
    {
        test: /\.js$/,
        loader: "babel-loader",
        include: ["/Users/ran/UNEED/ran/template/src"]
    },
    {
        test: /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/,
        loader: "url-loader",
        options: { limit: 10240, name: "static/img/[name].[hash:7].[ext]" }
    },
    {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: { limit: 3072, name: "static/media/[name].[hash:7].[ext]" }
    },
    {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: { limit: 10000, name: "static/fonts/[name].[hash:7].[ext]" }
    },
    {
        test: /\.css$/,
        use: ["vue-style-loader", [Object], [Object]]
    },
    {
        test: /\.postcss$/,
        use: ["vue-style-loader", [Object], [Object]]
    },
    {
        test: /\.less$/,
        use: ["vue-style-loader", [Object], [Object], [Object]]
    }
];
