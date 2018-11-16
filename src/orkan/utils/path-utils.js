import invariant from 'invariant';

const PATH_SEPARATOR_REGEX = '/';


export const stripRootFromPath = (path) => path.replace(/^\.\/?/, '');

export const validAbsolutePathInvariant = path => {
	const pathParts = path.split('/');
	invariant(pathParts.length && pathParts[0] === '.', 'expected an absolute path. the path should start with `.`');
};

export const getParentPath = path => {
	const pathParts = path.split(PATH_SEPARATOR_REGEX);

	if(pathParts.length > 1){
		return pathParts.slice(0, -1).join('/');
	}else{
		return pathParts[0];
	}
};


export const toAbsolutePath = path => {
	let pathParts = path.split('/');
	if(pathParts[0] !== '.'){
		pathParts.unshift('.');
	}
	pathParts = pathParts.filter(it => !!it);

	return pathParts.join('/');
};