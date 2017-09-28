/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const cssnext = require('postcss-cssnext');
const combineLoaders = require('webpack-combine-loaders');

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    remote: [
      'webpack-hot-middleware/client?reload=true',
      path.join(__dirname, 'app/remote.js')
    ],
    screen: [
      'webpack-hot-middleware/client?reload=true',
      path.join(__dirname, 'app/screen.js')
    ]
  },
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new ExtractTextPlugin("[name].css"),
    new HtmlWebpackPlugin({
      template: 'app/templates/remote.tpl.html',
      inject: 'body',
      filename: 'remote.html',
      chunks: ['remote']
    }),
    new HtmlWebpackPlugin({
      template: 'app/templates/screen.tpl.html',
      inject: 'body',
      filename: 'screen.html',
      chunks: ['screen']
    }),    
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss: [
          cssnext
        ]
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          babelrc: false,
          presets: [
            ['es2015', { loose:true }],
          ],
          plugins: []
        }
      }, {
        test: /\.html?$/,
        loader: 'html-loader'
      }, {
        test: /\.css$/,
        loader: combineLoaders([
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader',
          }, {
            loader: 'postcss-loader'
          }
        ])
      }
    ]
  },
};
