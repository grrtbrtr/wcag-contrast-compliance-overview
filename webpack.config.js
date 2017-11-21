const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractPlugin = new ExtractTextPlugin({
    filename: "bundle.css"
});

module.exports = {
	entry: path.resolve(__dirname, 'app', 'js', 'index.js'),
	output: {
		path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist'
	},
	module: {
		rules: [
			{
				enforce: "pre",
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "eslint-loader",
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader",
			},
			{
				test: /\.scss$/,
				use: extractPlugin.extract({
          use: [
          	'css-loader',
          	'sass-loader'
          ]
        })
			}
		]
	},
	resolve: {
		modules: [
			path.resolve('./app/js/lib'),
			path.resolve('./node_modules')
		]
	},
	devServer: {
		 contentBase: path.resolve(__dirname, 'app'),
		 publicPath: '/',
		 inline: true
	},
  plugins: [
      extractPlugin
  ]
}