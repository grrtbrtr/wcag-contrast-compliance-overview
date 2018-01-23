const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const extractPlugin = new ExtractTextPlugin({
  filename: 'bundle.css'
});

module.exports = {
	entry: path.resolve(__dirname, 'app', 'js', 'index.js'),
	output: {
		path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
	},
	module: {
		rules: [
      {
				enforce: 'pre',
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'eslint-loader',
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.scss$/,
				use: extractPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: () => {
									return [
										require('autoprefixer')({ browsers: 'last 2 versions' }),
                    require('cssnano')
									]
								}
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
			},
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
		]
	},
	resolve: {
		modules: [
			path.resolve('./app/js/lib'),
			path.resolve('./node_modules')
		]
	},
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'app', 'index.html')
    }),
    extractPlugin
  ]
}
