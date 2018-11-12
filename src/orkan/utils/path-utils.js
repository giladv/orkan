export const stripRootFromPath = (path) => path.replace(/^\.\/?/, '');


export const getParentPath = path => path === '.'?path:path.split('/').slice(0, -1).join('/');


export const toAbsolutePath = path => {
	let pathParts = path.split('/');
	if(pathParts[0] !== '.'){
		pathParts.unshift('.');
	}

	return pathParts.join('/');
};