import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { common } from './webpack.common';
import { Configuration } from 'webpack';

module.exports = [
  merge(common, {
    mode: 'production',
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        hash: true
      })
    ]
  } as Configuration)
];
