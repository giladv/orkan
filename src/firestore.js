import firebase from 'firebase/app';
import invariant from 'invariant';
import omitBy from 'lodash/omitBy';
import forEach from 'lodash/forEach';
import {observable, isObservable, toJS, action} from 'mobx';
import ObservableNestedMap from 'observable-nested-map';
import nodePath from 'path';

const validPathInvariant = path => {
	invariant(!!path.length, 'Invalid path, expected a non empty string');
	invariant(typeof path === 'string', 'Invalid path expected a string, got ' + typeof path);
	invariant(!path.startsWith('.') && !path.startsWith('/'), 'Invalid path structure. paths cannot start with `.` or `/`. got:' + path);
};

const validQueryInvariant = (path, options) => {
	invariant(!options || path.split('/').length === 1, `Invalid query arguments. cannot query non collections with options`);
};

const settablePathInvariant = path => {
	invariant(path.split('/').length <= 2, `Invalid query arguments. cannot use non collections paths with options`);
};

const collectionPathInvariant = path => invariant(path.split('/').length === 1, 'Invalid collection path. expected a path with one segment');


/*
	# how does it work?

	## listening to values
	- regardless the path requested, the most basic piece of data which will be loaded is a document
	- values returned will always be accurate to the path requested

	store.listen('objects/home/hero/title') => listens to objects/home
	store.load('objects/home/hero/title') => loads objects/home, returns objects/home/hero/title
	store.getValue('objects/home/hero/title') => returns objects/home/hero/title
	store.listen('posts/12345/title') => listens to posts/12345
	store.load('posts/12345/title') => loads posts/12345, returns posts/12345/title
	store.getValue('posts/12345/title') => returns posts/12345/title

	## listening to collections
	- don't use options on non collection paths

	store.listen('posts', {where.. orderBy..}) => listens to posts with options. on collections only
	store.load('posts', {where.. orderBy..}) => loads posts with options. on collections only
	store.getValue('posts', {where.. orderBy..}) => returns posts with options. on collections only

	## check initial loading status
	store.isLoading('posts') => return if posts is loading
	store.isLoading('posts', {where.. orderBy..}) => return if posts is running with options. on collections only
	store.isLoading('posts/12345/title') => return if posts/12345 is loading
	store.isLoading('objects/home/hero/title') -> return if objects/home is loading

	## setting values
	- setting values is available only on a collection or document level

	store.setValue('posts/1234', {...}) => will add/override posts/1234
	store.setValue('objects/home', {...}) => will add/override object/homes
	store.setValue('posts', {...}) => will push a new document to posts with auto key

	## removing values
	- removing values is available only on a document level

	store.remove('posts/1234') => will remove posts/1234
	store.remove('objects/home') => will remove objects/home
*/
export default class Firestore{
	api;

	map = new ObservableNestedMap({});

	pathsStatus = observable.map({});
	listeners = observable.map({});
	collections = observable.map({});

	config = {
		DocumentSnapshot: firebase.firestore.DocumentSnapshot,
		QuerySnapshot: firebase.firestore.QuerySnapshot,
		QueryDocumentSnapshot: firebase.firestore.QueryDocumentSnapshot,
	};

	constructor(api, options = {}){
		this.api = api;
		this.config = {
			...this.config,
			...options
		};

		window.a = () => console.log(this.map.toJS(), toJS(this.collections), toJS(this.listeners), toJS(this.pathsStatus))
	}

	getValue(path, options){
		validPathInvariant(path);
		validQueryInvariant(path, options);

		if(isCollectionPath(path)){
			const serializedPath = serializeQuery(path, options);
			const collection = this.collections.get(serializedPath) || [];

			return collection.map(collectionKey => {
				const value = this.map.get(toDotPath(nodePath.join(path, collectionKey)));

				const raw = isObservable(value)?toJS(value):value;
				if(typeof raw === 'object'){
					return {...raw, $key: collectionKey};
				}else{
					return {$value: raw, $key: collectionKey};
				}
			});
		}else{
			const value = this.map.get(toDotPath(path));
			return isObservable(value)?toJS(value):value;
		}
	}

	async setValue(path, value){
		validPathInvariant(path);
		settablePathInvariant(path);

		let sanitizedValue = value;
		if(typeof value === 'object'){
			sanitizedValue = omitBy(value, value => value === undefined);
		}

		const query = this.createQuery(path);
		const action = (query.add || query.set).bind(query);
		return await action(sanitizedValue);
	}

	addToCollection(serializedQuery, index, key){
		validPathInvariant(serializedQuery);

		let collection = this.collections.get(serializedQuery);
		if(!collection){
			collection = observable([]);
			this.collections.set(serializedQuery, collection);
		}

		collection.remove(key);
		collection.splice(index, 0, key);
	}

	removeFromCollection(serializedQuery, key){
		let collection = this.collections.get(serializedQuery);
		collection.remove(key);
	}



	listen(path, options){
		validPathInvariant(path);
		const serializedQuery = serializeQuery(path, options);

		let listener = this.listeners.get(serializedQuery);

		if(listener){
			listener.listeners++;
		}else{
			this.setPathIsLoading(serializedQuery, true);
			const query = this.createQuery(path, options);
			const destroy = query.onSnapshot(action(snapshot => {
				this.handleNewSnapShot(path, options, snapshot);
				this.setPathIsLoading(serializedQuery, false);
			}), err => {
				console.error(err)
			});

			listener = observable({
				listeners: 1,
				destroy
			});

			this.listeners.set(serializedQuery, listener);
		}

		return () => {
			listener.listeners--;
			if(!listener.listeners){
				listener.destroy();
				this.listeners.delete(serializedQuery);
			}
		}
	}


	@action async load(path, options){
		validPathInvariant(path);
		const serializedQuery = serializeQuery(path, options);
		this.setPathIsLoading(serializedQuery, true);
		const query = this.createQuery(path, options);

		const snapshot = await query.get();
		this.handleNewSnapShot(path, options, snapshot);
		this.setPathIsLoading(serializedQuery, false);
		return this.getValue(path, options);
	}

	@action handleNewSnapShot(path, options, snapshot){
		const sanitizedPath = toQueryablePath(path);
		if(this.isDocumentSnapshot(snapshot)){
			if(snapshot.exists){
				this.map.set(toDotPath(sanitizedPath), snapshot.data());
			}else{
				this.map.remove(toDotPath(sanitizedPath));
			}

		}else if(this.isCollectionSnapshot(snapshot)){
			// no need to sanitize path because only collection paths end up here
			const serializedQuery = serializeQuery(path, options);

			snapshot.docChanges().forEach(change => {
				const docPath = nodePath.join(path, change.doc.id);
				switch(change.type){
					case 'modified':
						this.map.set(toDotPath(docPath), change.doc.data());
						if(change.oldIndex > -1 && change.newIndex !== change.oldIndex){
							this.addToCollection(serializedQuery, change.newIndex, change.doc.id);
						}
						break;
					case 'added':
						this.map.set(toDotPath(docPath), change.doc.data());
						this.addToCollection(serializedQuery, change.newIndex, change.doc.id);
						break;
					case 'removed':
						this.map.remove(toDotPath(docPath));
						this.removeFromCollection(serializedQuery, change.doc.id);
						break;
				}
			});
		}
	}



	remove(path){
		validPathInvariant(path);
		settablePathInvariant(path);
		this.map.remove(toDotPath(path));
		return this.createQuery(path).delete();
	}


	clearCache(path){
		validPathInvariant(path);
		this.map.remove(toDotPath(path));
	}

	setPathStatus(serializedQuery, status){
		validPathInvariant(serializedQuery);

		const currentStatus = this.pathsStatus.get(serializedQuery) || {};
		this.pathsStatus.set(serializedQuery, {...currentStatus, ...status});
	}

	setPathIsLoading(serializedQuery, state){
		validPathInvariant(serializedQuery);

		const currentStatus = this.pathsStatus.get(serializedQuery);
		if(!currentStatus || !state){
			this.setPathStatus(serializedQuery, {isLoading: state});
		}
	}

	isLoading(serializedQuery){
		validPathInvariant(serializedQuery);
		const currentStatus = this.pathsStatus.get(serializedQuery);
		return currentStatus && currentStatus.isLoading;
	}

	createQuery(path, options = {}){
		const {collection, docPath} = breakPath(path);
		let query = this.api.collection(collection);

		if(docPath){
			query = query.doc(docPath);
		}

		query = applyWhereOptionsToQuery(query, options.where);
		query = applyOrderByOptionsToQuery(query, options.orderBy);

		return query;
	}

	generateKey(path){
		collectionPathInvariant(path);
		return this.api.collection(path).doc().id;
	}

	isDocumentSnapshot(snapshot){
		return typeof snapshot.data == 'function';
		return snapshot instanceof this.config.DocumentSnapshot || snapshot instanceof this.config.QueryDocumentSnapshot;
	}

	isCollectionSnapshot(snapshot){
		return typeof snapshot.forEach == 'function';
		return snapshot instanceof this.config.QuerySnapshot;
	}
}



/*
	where: {
		path: {operator: value},
		...
	}
*/
const applyWhereOptionsToQuery = (query, whereOptions = {}) => {
		let finalQuery = query;
		iterateWhereOptions(whereOptions, (path, optionOperator, optionValue) => finalQuery = finalQuery.where(path, optionOperator, optionValue))
		return finalQuery;
};

const iterateWhereOptions = (whereOptions, cb) => {
	forEach(whereOptions, (option, path) => {
		forEach(option, (optionValue, optionOperator) => cb(path, optionOperator, optionValue))
	});
};

const serializeQueryOptions = (options = {}) => {
	const queryString = [];
	iterateWhereOptions(options.where, (path, optionOperator, optionValue) => queryString.push(`where=${path}${optionOperator}${optionValue}`));

	forEach(options.orderBy, (direction, path) => {
		queryString.push(`orderBy:${path}|${direction}`);
	});

	return queryString.join('&');
};


export const serializeQuery = (path, options) => toQueryablePath(path) + '?' + serializeQueryOptions(options);


/*
	orderBy: {
		path: 'asc'|'desc',
		...
	}
*/
const applyOrderByOptionsToQuery = (query, orderByOptions = {}) => {
	let finalQuery = query;
	forEach(orderByOptions, (direction, path) => {
		finalQuery = finalQuery.orderBy(path, direction)
	});
	return finalQuery;
};

export const toDotPath = slashPath => slashPath.split('/').join('.');

export const breakPath = path => {
	const [collection, docPath, ...innerParts] = path.split('/');
	return {collection, docPath, innerPath: innerParts.join('/')};
};

export const toQueryablePath = path => path.split('/').slice(0,2).join('/');


const isCollectionPath = path => path.split('/').length === 1;



/*

	schema editor
	- on root you can create collections and documents inside an object like collection named


	Schema Editor        +  <-- adds a collection
	- objects       ///  +  <-- adds a document inside the objects object like collection

	- posts        [///] +  <-- adds a field to document
		- title          +  <-- adds a field under title, set title as object
		- tags     [///] +  <-- adds a field under tags, set tags as array


{
	objects: {
		home:{
			title: string
		}
	}
	posts: [{
		title: string,
		tags: []
	}]
	orkanUsers: [{
		avatar,
		email,
		editData,
		editSchema,
		editUsers
	}],
	orkanUsersRequests: [{
		uid,
		avatar,
		email
	}]
	orkanObjects: {
		schema: {}
		schemaSettings: {}
	}
}



store.listen('orkanUsers').value
store.listen('orkanUsers').isLoading


store.listen('orkanUsers')
store.getValue('orkanUsers')
store.getStatus('orkanUsers')







store.listen('objects/home/hero/title') => listens to objects/home
store.load('objects/home/hero/title') => loads objects/home, returns objects/home/hero/title
store.getValue('objects/home/hero/title') => returns objects/home/hero/title

store.listen('posts/12345/title') => listens to posts/12345
store.load('posts/12345/title') => loads posts/12345, returns posts/12345/title
store.getValue('posts/12345/title') => returns posts/12345/title

store.listen('posts', {where.. orderBy..}) => listens to posts with options. on collections only
store.load('posts', {where.. orderBy..}) => loads posts with options. on collections only
store.get('posts', {where.. orderBy..}) => returns posts with options. on collections only





*/
// class Test{
// 	v;
// 	constructor(){
// 		this.atom = createAtom('test', () => {
// 			console.log('observed');
// 			setInterval(() => {
// 				this.v = Math.random();
// 				this.atom.reportChanged();
// 			}, 1000);
// 		}, () => {
// 			console.log('unobserved');
// 		});
//
//
// 	}
//
// 	get value(){
// 		if(this.atom.reportObserved()){
// 			return this.v;
// 		}
//
// 		return 0;
//
// 	}
// }
//
// window.t = new Test();
//
//
// window.ob = () => autorun(() => {
// 		console.log(t && t.value);
// 	});
