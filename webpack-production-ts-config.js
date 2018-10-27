const merge = require('webpack-merge');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const commonConfig = require('./webpack-common-ts-config');

module.exports = merge(commonConfig, {
	externals: [nodeExternals()],
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		})
	]
});