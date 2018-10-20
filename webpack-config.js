const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProd = process.env.NODE_ENV == 'production';

const prodGlobalsPlugin = new webpack.DefinePlugin({
	// A common mistake is not stringifying the "production" string.
	// 'process.env.NODE_ENV': JSON.stringify('production')
});

const config = {
	entry: ['babel-polyfill', './src/index.js'],
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/', // this maked the bundle.js to be served at root in dev-derver
		filename: 'bundle.js'
	},
	devServer: {
		// watchOptions: {
		// 	watch: false
		// },
		historyApiFallback: {
			// the default url rewrite does not cover routes with '.' in them e.g some/route/with.dot
			// so this fixes everything
			rewrites: [
				{
					from: /^.*$/,
					to: () => '/index.html'
				}
			]
		}
	},
	devtool: "#eval",
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
						// presets: ['es2015', 'react', 'stage-0'],
						// plugins: ['transform-decorators-legacy'],
						// sourceMap: 'inline'
					}
				}],
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
				exclude: /node_modules/
			},
			{
				test: /\.(png|woff|woff2|eot|ttf|svg|jpg)$/,
				exclude: /node_modules/,
				use: 'url-loader'
			}
		]
	},
	resolve: {
		extensions: ['.js', '.scss', '.css']
	},
	// noParse: [
	// 	'node_modules'
	// ],
	plugins: [
		prodGlobalsPlugin,
		// new CopyWebpackPlugin([
		// 	{
		// 		from: 'node_modules/monaco-editor/min/vs',
		// 		to: 'vs',
		// 	}
		// ])
	],
	externals: [
		(function(){
			const IGNORES = ['electron'];
			return function(context, request, callback){
				if(IGNORES.includes(request)){
					return callback(null, "require('" + request + "')");
				}
				return callback();
			};
		})()
	]

};

if(isProd){
	config.plugins.push(prodGlobalsPlugin);
}

module.exports = config;
