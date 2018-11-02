const {getReadableCssClassName, getDistPath} = require('./utils');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => {
	let isDev = argv.mode === 'development';

	return {
		entry: './src/orkan/admin/index.js',
		output: {
			path: getDistPath(),
			publicPath: '/', // this maked the bundle.js to be served at root in dev-derver
			filename: 'admin.js',
			library: '__orkan_admin__',
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
					use: [
						'style-loader',
						'css-loader'
					],
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
		devtool: "cheap-module-source-map",
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
		optimization: {
			// minimize: false
		},
		externals: {
			react: 'React',
			'react-dom': 'ReactDOM',
			mobx: 'mobx',
			'prop-types': 'PropTypes',
			'classnames': 'classNames',
			'autobind-decorator': 'autobind',
			'firebase/app': 'firebase',
			'firebase/storage': 'firebase',
			'firebase/auth': 'firebase',
			'firebase/database': 'firebase',
		},
		plugins: [
			// new BundleAnalyzerPlugin()
		]
	};
};


