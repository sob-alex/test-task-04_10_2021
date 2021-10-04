const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
  CleanWebpackPlugin,
} = require('clean-webpack-plugin');

console.log(process.env.NODE_ENV);

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const styleLoader = isProduction
    ? {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '',
        },
      }
    : 'style-loader';

  const config = {
    entry: {
      main: './src/js/index/main.js',
    },
    output: {
      filename: '[contenthash]-[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.(scss|css)$/,
          use: [styleLoader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'assets/[contenthash].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(mp4)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'assets/[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    devServer: {
      contentBase: './dist',
      liveReload: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        chunks: ['main'],
        minify: {
          removeRedundantAttributes: false,
        },
        favicon: './src/assets/images/favicon.png',
        title: 'Development',
      }),
    ],
  };

  if (!isProduction) config.devtool = 'inline-source-map';
  if (isProduction) {
    config.plugins.push(new CleanWebpackPlugin());
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
        ignoreOrder: false,
      })
    );
  }

  return config;
};
