import merge from 'webpack-merge';
import { common } from './webpack.common';
import HtmlWebpackPlugin from 'html-webpack-plugin';

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
      contentBase: './public',
      compress: true,
      port: 4200,
      historyApiFallback: {
        disableDotRule: true
      }
    }
  } as any)
];
