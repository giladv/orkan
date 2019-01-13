import invariant from 'invariant';
import omitBy from 'lodash/omitBy';
import forEach from 'lodash/forEach';
import find from 'lodash/find';
import {observable, isObservable, toJS, action, when, computed} from 'mobx';
import ObservableNestedMap from 'observable-nested-map';
import nodePath from 'path';
import firebase from 'firebase/app';

const validPathInvariant = path => {
	invariant(!!path.length, 'Invalid path, expected a non empty string');
	invariant(typeof path === 'string', 'Invalid path expected a string, got ' + typeof path);
	invariant(!path.startsWith('.') && !path.startsWith('/'), 'Invalid path structure. paths cannot start with `.` or `/`. got:' + path);
};

const validQueryInvariant = (path, options) => {
	invariant(!options || path.split('/').length === 1, `Invalid query arguments. cannot query non collections with options`);
};

const settablePathInvariant = path => {
	invariant(path.split('/').length <= 2, `Non queryable path ` + path);
};

const collectionPathInvariant = path => invariant(path.split('/').length === 1, 'Invalid collection path. expected a path with one segment');



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

const serializeQueryOptions = (options = {}, includeLimit = false) => {
	const queryString = [];
	iterateWhereOptions(options.where, (path, optionOperator, optionValue) => queryString.push(`where=${path}${optionOperator}${optionValue}`));

	forEach(options.orderBy, (direction, path) => {
		queryString.push(`orderBy:${path}|${direction}`);
	});

	includeLimit && options.limit !== undefined && queryString.push(`limit:${options.limit}`);

	return queryString.join('&');
};


export const serializeQuery = (path, options, includeLimit) => toQueryablePath(path) + '?' + serializeQueryOptions(options, includeLimit);


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
	- collections data and order are cached even if not listened to anymore, to ensure fresh order on next listen - clear cache

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

/** @module */




/**
 * A thin observable wrapper around Firestore's SDK
 * @param {firebae.firestore} api - A Firebase SDK Firestore instance
 * @param {object} [initialState] - the initial state of the store, perfect for server rendering hydration process
 * @param {object} [options] - an options object which accepts DocumentSnapshot, QuerySnapshot and QueryDocumentSnapshot
 * */
export default class Firestore{
	static toDotPath = toDotPath;
	static breakPath = breakPath;
	static toQueryablePath = toQueryablePath;

	api;

	map = new ObservableNestedMap({});

	pathsStatus = observable.map({});
	listeners = observable.map({});
	collections = observable.map({});

	options = {
		DocumentSnapshot: firebase.firestore.DocumentSnapshot,
		QuerySnapshot: firebase.firestore.QuerySnapshot,
		QueryDocumentSnapshot: firebase.firestore.QueryDocumentSnapshot
	};

	constructor(api, initialState = {}, options = {}){
		this.api = api;

		this.map.merge(initialState.map);
		this.collections.merge(initialState.collections);
		this.pathsStatus.merge(initialState.pathsStatus);
		this.listeners.merge(initialState.listeners);

		this.options = {
			...this.options,
			...options
		};

	}

	getBusyPromise(){
		const isBusy = () => !!find(toJS(this.pathsStatus), path => path.isLoading);
		if(isBusy()){
			return when(() => !isBusy());
		}
	}

	/**
	 * Synchronously returns an observable value from the local cache.
	 * @param {string} path - the path of the data in the database
	 * @param {object} [options] - an options object which accepts where, orderBy, limit
	 * @returns {any}
	 * */
	getValue(path, options){
		validPathInvariant(path);
		validQueryInvariant(path, options);

		if(isCollectionPath(path)){
			const serializedPath = serializeQuery(path, options);
			const collection = this.collections.get(serializedPath) || [];
			const limit = (options && options.limit) || collection.length;

			return collection.slice(0, limit).map(collectionKey => {
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

	/**
	 * Writes into a path and updates local cache.
	 * if the path is a collection path, a document with an auto generated id will be pushed
	 * @param {string} path - the path of the data in the database
	 * @param {any} value - the new value to write
	 * @returns {promise}
	 * */
	async setValue(path, value){
		validPathInvariant(path);
		settablePathInvariant(path);

		let sanitizedValue = value;
		if(typeof value === 'object'){
			sanitizedValue = omitBy(value, value => value === undefined);
		}

		const query = this.createQuery(path);
		const action = (query.add || query.set).bind(query);
		this.map.set(toDotPath(path), value);

		return await action(sanitizedValue);
	}

	@action addToCollection(serializedQuery, index, key){
		validPathInvariant(serializedQuery);

		let collection = this.collections.get(serializedQuery);
		if(!collection){
			collection = observable([]);
			this.collections.set(serializedQuery, collection);
		}

		!collection.includes(key) && collection.splice(index, 0, key);
	}

	@action removeFromCollection(serializedQuery, key){
		let collection = this.collections.get(serializedQuery);
		collection.remove(key);
	}

	@action removeCollection(serializedQuery){
		this.collections.delete(serializedQuery);
	}


	/**
	 * Register a path to listen to, updates will update th local cache automatically
	 * @param {string} path - the path of the data in the database
	 * @param {object} [options] - an options object which accepts where, orderBy, limit
	 * @returns {function} a destroy function for the listener
	 * */
	listen(path, options){
		validPathInvariant(path);
		const serializedQuery = serializeQuery(path, options, true);

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
				console.warn(`[${serializedQuery}]`, err);
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

	/**
	 * Loads a value once from the database and update the local cache
	 * @param {string} path - the path of the data in the database
	 * @param {object} [options] - an options object which accepts where, orderBy, limit
	 * @returns {promise} when resolved, will contain the loaded value
	 * */
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

			typeof snapshot.docChanges === 'function' && snapshot.docChanges().forEach(change => {
				const docPath = nodePath.join(path, change.doc.id);

				switch(change.type){
					case 'modified':
						this.map.set(toDotPath(docPath), change.doc.data());
						if(change.oldIndex > -1 && change.newIndex !== change.oldIndex){
							this.removeFromCollection(serializedQuery, change.doc.id);
							this.addToCollection(serializedQuery, change.newIndex, change.doc.id);
						}
						break;
					case 'added':
						this.map.set(toDotPath(docPath), change.doc.data());
						this.addToCollection(serializedQuery, change.newIndex, change.doc.id);
						break;
					case 'removed':
						// not removing the document from this.map, it can be still used by another
						this.removeFromCollection(serializedQuery, change.doc.id);
						break;
				}
			});
		}
	}


	/**
	 * Removes a path from the database and local cache
	 * @param {string} path - the path of the data in the database
	 * @returns {promise}
	 * */
	remove(path){
		validPathInvariant(path);
		settablePathInvariant(path);
		this.map.remove(toDotPath(path));
		return this.createQuery(path).delete();
	}


	clearCache(path, options){
		validPathInvariant(path);
		const serializedQuery = serializeQuery(path, options);
		const serializedQueryWithLimit = serializeQuery(path, options, true);
		this.map.remove(toDotPath(path));
		this.removeCollection(serializedQuery);
		this.removePathStatus(serializedQuery);
	}

	@action clearAll(){
		this.map.clear();
		this.pathsStatus.clear();
		this.collections.clear();
		this.listeners.clear();
	}

	@action removePathStatus(serializedQuery){
		validPathInvariant(serializedQuery);
		this.pathsStatus.delete(serializedQuery);
	}

	@action setPathStatus(serializedQuery, status){
		validPathInvariant(serializedQuery);

		const currentStatus = this.pathsStatus.get(serializedQuery) || {};
		this.pathsStatus.set(serializedQuery, {...currentStatus, ...status});
	}

	@action setPathIsLoading(serializedQuery, state){
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

	isPathLoading(path, options){
		return this.isLoading(serializeQuery(path, options));
	}

	createQuery(path, options = {}){
		const {collection, docPath} = breakPath(path);
		let query = this.api.collection(collection);

		if(docPath){
			query = query.doc(docPath);
		}

		query = applyWhereOptionsToQuery(query, options.where);
		query = applyOrderByOptionsToQuery(query, options.orderBy);
		if(options.limit){
			query = query.limit(options.limit);
		}

		return query;
	}

	generateKey(path){
		collectionPathInvariant(path);
		return this.api.collection(path).doc().id;
	}

	isDocumentSnapshot(snapshot){
		return snapshot instanceof this.options.DocumentSnapshot || snapshot instanceof this.options.QueryDocumentSnapshot;
	}

	isCollectionSnapshot(snapshot){
		return snapshot instanceof this.options.QuerySnapshot;
	}

	toJS(){
		return {
			map: this.map.toJS(),
			collections: toJS(this.collections),
			pathsStatus: toJS(this.pathsStatus),
			listeners: toJS(this.listeners)
		};
	}
}