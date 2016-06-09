/**
 * Created by scofield on 5/31/16.
 */
var WebpackDevServer = require("webpack-dev-server"),
    webpack = require("webpack"),
    webpackConfig = require("./webpack.config");

    webpackConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:8088");
    webpackConfig.entry.angular.unshift("webpack-dev-server/client?http://localhost:8088");

var server = new WebpackDevServer(webpack(webpackConfig),{
        contentBase:__dirname,
        hot:true,
        inline:true,
        historyApiFallback:false,
        compress:true,
        proxy:{
            "/api/v1*":{
                target:"http://localhost:8081",
                secure:false
            },
            "/":{
                target:"http://localhost:8081",
                secure:false
            }
        },
        quiet:false,
        noInfo:false,
        lazy:false,
        publicPath:webpackConfig.output.publicPath,
        filename:webpackConfig.output.filename
    });

server.listen(8088,"localhost",function(){
    console.info("run at localhost:8888,open the http://localhost:8088 on your browser to develop!");
});
