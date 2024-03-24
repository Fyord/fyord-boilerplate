import merge from 'webpack-merge';
import { common } from './webpack.common';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';

module.exports = [
  merge(common, {
    mode: 'production',
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      })
    ],
    devtool: 'inline-source-map',
    devServer: {
      compress: true,
      port: 4200,
      historyApiFallback: {
        disableDotRule: true
      }
    },
    performance: {
      hints: false
    }
  } as Configuration)
];
