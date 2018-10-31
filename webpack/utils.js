const loaderUtils = require('loader-utils');
const path = require('path');


module.exports.getReadableCssClassName = (loaderContext, localIdentName, localName, options) => {
	const pathParts = loaderContext.resourcePath.split(path.sep);
	const folderName = pathParts[pathParts.length - 2];
	const camelFolderName = folderName.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('');
	const hash = loaderUtils.getHashDigest(loaderContext.resourcePath, 'md5', 'base64', 2);
	return `${camelFolderName}-${localName}-${hash}`;
};



module.exports.isProd = () => process.env.NODE_ENV === 'production';
module.exports.isDev = () => process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;


module.exports.getDistPath = () => path.resolve(__dirname, '../dist');