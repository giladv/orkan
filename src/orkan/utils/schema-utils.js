import forEach from 'lodash/forEach';
import isObject from 'lodash/isObject';
import {COLLECTION_KEY} from '../constants';

export const schemaGet = (schema, path) => {
	let pathParts = path.split('/').filter(it => !!it);
	pathParts.shift();

	let returnValue = schema;

	while(returnValue && pathParts.length){
		const part = pathParts.shift();
		returnValue = returnValue[part] || returnValue[COLLECTION_KEY];
	}

	return returnValue;
};


export const toSchemaPath = (schema, path) => {
	let pathParts = path.split('/').filter(it => !!it);

	let subSchema = schema;
	let schemaPathParts = [pathParts.shift()];

	while(subSchema && pathParts.length){
		const part = pathParts.shift();
		if(subSchema[part]){
			schemaPathParts.push(part);
		}else if(subSchema[COLLECTION_KEY]){
			schemaPathParts.push('_');
		}else{
			return;
		}

		subSchema = subSchema[part] || subSchema[COLLECTION_KEY];
	}

	return schemaPathParts.join('/');
};


export const getSchemaPrimitiveKeysByPath = (schema, path) => {
	const pathSchema = schemaGet(schema, path);
	return !pathSchema?[]:Object.keys(pathSchema)
		.filter(key => !isObject(pathSchema[key]))
};


export const getSchemaCollectionPaths = (schema) => {
	let collectionPaths = [];
	schemaWalk(schema, (value, path) => {
		if(path[path.length-1] === '_'){
			collectionPaths.push(path.slice(0, -1).join('/'));
		}
	});

	return collectionPaths;
};

export const schemaWalk = (schema, cb, path = ['.']) => {
	forEach(schema, (value, key) => {
		cb(value, [...path, key]);
		if(isObject(value)){
			schemaWalk(value, cb, [...path, key]);
		}
	});
};