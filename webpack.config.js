var path = require("path"),
    webpack = require("webpack");

module.exports={
    context:__dirname + "/app",
    entry:{
        app:["./router.js"],
        angular:["angular","angular-md5","angular-cookies","angular-ui-router","angular-resource"]
    },
    output:{
        filename:"[name].js",
        path:path.resolve(__dirname,"statics"),
        publicPath:"/statics/"
    },
    module:{
        loaders:[
            {
                test:/\.css$/,
                loader:"style!css!autoprefixer-loader"
            },
            {
                test:/\.js$/,
                exclude:/(node_modules|bower_components)/,
                loader:'babel',
                query:{
                    presets:['es2015']
                }
            }
        ]
    },
    plugins:[
        new webpack.optimize.CommonsChunkPlugin({
            filename:"./utils/utils.js",
            name:"angular",
            minChunks: Infinity,
            chunks:["angular"]
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
