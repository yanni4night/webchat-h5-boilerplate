const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BellOnBundlerErrorPlugin = require('bell-on-bundler-error-plugin')
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'js/[name].[chunkhash].js',
        publicPath: './',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: 'css-loader'
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function () {
                            return [
                                require('autoprefixer'),
                                require('cssnano')
                            ];
                        }
                    }
                }, {
                    loader: 'less-loader'
                }]
            })
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: 'css-loader'
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function () {
                            return [
                                require('autoprefixer'),
                                require('cssnano')
                            ];
                        }
                    }
                }]
            })
        }, {
            test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
            loader: `url-loader?limit=10240&name=[name].[contenthash].[ext]`
        }]
    },
    plugins: [
        new WebpackShellPlugin({
            onBuildStart: ['npm run clean']
        }),
        new BellOnBundlerErrorPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html'
        }), new ExtractTextPlugin('css/[name].[contenthash].css'),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: function (module) {
                   return module.context && module.context.indexOf('node_modules') !== -1;
                }
            })
    ]
};