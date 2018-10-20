const merge = require('webpack-merge');

const commonConfig = require('./webpack-common-ts-config');

module.exports = merge(commonConfig, {
	devtool: "cheap-module-source-map",
	plugins: [
	],

	devServer: {
		watchOptions: {
			watch: false
		},
		contentBase: './dist',
		compress: true,
		historyApiFallback: {disableDotRule: true}
	},
});