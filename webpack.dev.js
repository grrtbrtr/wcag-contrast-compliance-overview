const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
	devServer: {
		contentBase: path.resolve(__dirname, 'app'),
		publicPath: '/',
		inline: true
	}
});
