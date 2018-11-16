import forEach from 'lodash/forEach';
import {validAbsolutePathInvariant} from './path-utils';




export const schemaGet = (schema, path) => {
	validAbsolutePathInvariant(path);
	let pathParts = path.split('/').filter(it => !!it);
	pathParts.shift();
	let returnValue = schema;

	while(returnValue && pathParts.length){
		const part = pathParts.shift();
		returnValue = returnValue[part] || returnValue[0];
	}

	return returnValue;
};


export const toSchemaPath = (schema, path) => {
	validAbsolutePathInvariant(path);
	let pathParts = path.split('/').filter(it => !!it);

	let subSchema = schema;
	let schemaPathParts = [pathParts.shift()];

	while(subSchema && pathParts.length){
		const part = pathParts.shift();

		if(subSchema[part]){
			schemaPathParts.push(part);
		}else if(subSchema[0]){
			schemaPathParts.push(0);
		}else{
			return;
		}

		subSchema = subSchema[part] || subSchema[0];
	}

	return schemaPathParts.join('/');
};

export const getSchemaCollectionPaths = (schema) => {
	let collectionPaths = [];
	schemaWalk(schema, (value, path) => {
		if(Array.isArray(value)){
			collectionPaths.push(path.join('/'));
		}
	});

	return collectionPaths;
};

export const schemaWalk = (schema, cb, path = ['.']) => {
	forEach(schema, (value, key) => {
		cb(value, [...path, key]);
		if(typeof value === 'object'){
			schemaWalk(value, cb, [...path, key]);
		}
	});
};