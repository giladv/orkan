const webpack = require('webpack');

const nodeExternals = require('webpack-node-externals');

const {getUniqueCssClassName, getReadableCssClassName, getDistPath} = require('./utils');

module.exports = (env, argv) => {
	let isDev = argv.mode === 'development';

	return {
		entry: {
			index: './src/index.js',
		},
		output: {
			path: getDistPath(),
			publicPath: '/', // this make the bundle.js to be served at root in dev-derver
			filename: '[name].js',
			library: 'orkan',
			globalObject: 'typeof self !== \'undefined\' ? self : this',
			libraryTarget: 'umd',
			umdNamedDefine: true,
		},
		module: {
			rules: [
				{
					test: /\.(js|ts|tsx)$/,
					use: [
						{
							loader: 'ts-loader',
							options: {
								transpileOnly: true
							}
						}
					],
					exclude: [/node_modules/]
				},
				{
					test: /\.scss$/,
					exclude: /node_modules/,
					use: [
						'style-loader/useable',
						{
							loader: 'css-loader',
							options: {
								modules: true,
								getLocalIdent: isDev?getReadableCssClassName:getUniqueCssClassName
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
			minimize: false,
			// splitChunks: {
			// 	cacheGroups: {
			// 		// default: {
			// 		// 	name: true,
			// 		// 	chunks: 'initial',
			// 		// 	minSize: 0
			// 		// },
			// 		default: {
			// 			chunks: 'initial',
			// 			name: (module) => {
			// 				const pathParts = module.resource.split('/');
			// 				const fileName = pathParts[pathParts.length-1];
			// 				const folderName = pathParts[pathParts.length-2];
			//
			// 				console.log(folderName, fileName);
			//
			// 				if(fileName === 'index.js' || fileName === 'style.scss'){
			// 					return folderName;
			// 				}else{
			// 					return fileName.split('.')[0];
			// 				}
			// 			},
			// 			minChunks: 2,
			// 			minSize: 0,
			// 			test: /src\/(inject|firestore|utils)/,
			// 			reuseExistingChunk: true,
			// 			// enforce: true
			// 		}
			// 	}
			// }
		},

		devtool: isDev?'cheap-module-source-map':false,
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