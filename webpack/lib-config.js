const nodeExternals = require('webpack-node-externals');

const {getReadableCssClassName, getDistPath} = require('./utils');

module.exports = (env, argv) => {
	let isDev = argv.mode === 'development';

	return {
		entry: {
			orkan: './src/orkan/index.js',
		},
		output: {
			path: getDistPath(),
			publicPath: '/', // this maked the bundle.js to be served at root in dev-derver
			filename: 'orkan.js',
			library: 'orkan',
			libraryTarget: 'umd',
			umdNamedDefine: true
		},
		module: {
			rules: [
				{
					test: /\.(js|ts|tsx)$/,
					// use: 'awesome-typescript-loader',
					use: [
						{
							loader: 'ts-loader',
							options: {
								transpileOnly: true
							}
						}
					],
					exclude: /node_modules/
				},
				{
					test: /\.scss$/,
					exclude: /node_modules/,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: {
								modules: true,
								localIdentName: '[hash:base64:5]',
								getLocalIdent: isDev && getReadableCssClassName
							}
						},
						'sass-loader'
					],
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
					// exclude: /node_modules/
				},
				{
					test: /\.(png|woff|woff2|eot|ttf|svg|jpg)/,
					exclude: /node_modules/,
					use: 'url-loader'
				}
			]
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.json', '.scss', '.css']
		},
		optimization: {
			minimize: false
		},


		devtool: "cheap-module-source-map",
		devServer: {
			watchOptions: {
				watch: false
			},
			contentBase: './dist',
			compress: true,
			historyApiFallback: {disableDotRule: true}
		},


		externals: [nodeExternals()],
	};
}