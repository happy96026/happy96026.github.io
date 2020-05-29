const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const chokidar = require('chokidar')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(scss|sass|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true
            }
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'assets',
          publicPath: 'assets'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!CNAME']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      publicPath: 'assets'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    open: true,
    host: '0.0.0.0',
    port: 8000,
    hot: true,
    before(_, server) {
      chokidar.watch(['./src/index.html']).on('all', () => {
        server.sockWrite(server.sockets, 'content-changed')
      })
    }
  }
}
