const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/', // this maked the bundle.js to be served at root in dev-derver
		filename: 'app.js',
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
				use: ['style-loader', 'css-loader', 'sass-loader'],
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
		// minimize: false,
		// namedModules: true,
		// namedChunks: true
	},
	devtool: "cheap-module-source-map",
	plugins: [
	],

	devServer: {
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		watchOptions: {
			watch: false
		},
		contentBase: './dist',
		compress: true,
		historyApiFallback: {disableDotRule: true}
	},
	externals: {}
};