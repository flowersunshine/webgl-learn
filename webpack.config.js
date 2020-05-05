const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/rotateObject.js',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ],
                use: ['babel-loader']
            },
            {
                test: /\.(jpg|png|svg|gif)$/,
                use: ['url-loader']
            }
        ]
    },
    plugins: [
        // new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {//配置此静态文件服务器，可以用来预览打包后项目
        inline:true,//打包后加入一个websocket客户端
        hot:true,//热加载
        contentBase: path.resolve(__dirname, 'dist'),//开发服务运行时的文件根目录
        host: 'localhost',//主机地址
        port: 8080,//端口号
        compress: true,//开发服务器是否启动gzip等压缩
        clientLogLevel: 'none'
      }
};