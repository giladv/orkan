import omitBy from 'lodash/omitBy';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import {observable, isObservable, toJS} from 'mobx';
import nodePath from 'path';

import {ObservableNestedMap} from './form/observable-nested-map';

export default class FirebaseStore{
	database;
	rootPath;

	map = new ObservableNestedMap({});

	pathsStatus = observable.map({});
	listeners = observable.map({});
	collections = observable.map({});

	constructor(database, rootPath = 'orkan'){
		this.database = database;
		this.rootPath = rootPath;

		window.a = () => console.log(this.map.toJS(), this.collections.toJS(), this.listeners.toJS())
	}

	toAbsolutePath(path){
		return nodePath.join(this.rootPath, path);
	}

	getValue(path, options){
		if(options && !isEmpty(options)){
			const pathWithQueryString = path + '?' + optionsToQueryString(options);
			const collection = this.collections.get(pathWithQueryString) || [];
			return collection.map(collectionKey => {
				const value = this.map.get(toDotPath(nodePath.join(path, collectionKey)))
				return isObservable(value)?toJS(value):value
			});
		}else{
			const value = this.map.get(toDotPath(path));
			return isObservable(value)?toJS(value):value;
		}
	}

	setValue(path, value){
		let sanitizedValue = value;
		if(typeof value === 'object'){
			sanitizedValue = omitBy(value, value => value === undefined);
		}
		return this.database.ref(this.toAbsolutePath(path)).set(sanitizedValue);
	}


	push(path){
		return this.database.ref(this.toAbsolutePath(path)).push();
	}


	listen(path){

		let listener = this.listeners.get(path);

		if(listener){
			listener.listeners++;
		}else{
			const valueHandler = (snapshot) => {
				const snapshotVal = snapshot.exportVal();
				const dotPath = path.split('/').join('.');

				if(snapshotVal){
					this.map.set(dotPath, snapshotVal);
				}else{
					this.map.set(dotPath, null);
				}
				this.setPathIsLoading(path, false);
			};

			this.setPathIsLoading(path, true);
			const ref = createRefWithOptions(this.database.ref(this.toAbsolutePath(path)), options);
			ref.on('value', valueHandler);

			listener = observable({
				listeners: 1,
				destroy: () => {
					ref.off('value', valueHandler);
				}
			});

			this.listeners.set(path, listener);
		}


		return () => {
			listener.listeners--;
			if(!listener.listeners){
				listener.destroy();
				this.listeners.set(path);
			}
		}
	}


	listenToCollection(path, options){


		const pathWithQueryString = path + '?' + optionsToQueryString(options);

		let listener = this.listeners.get(pathWithQueryString);

		if(listener){
			listener.listeners++;
		}else{
			const ref = createRefWithOptions(this.database.ref(this.toAbsolutePath(path)), options);

			const addedHandler = (snapshot, prevKey) => {
				const childPath = nodePath.join(path, snapshot.key);
				this.map.set(toDotPath(childPath), snapshot.exportVal());
				this.addToCollection(pathWithQueryString, prevKey, snapshot.key);
			};

			const removedHandler = (snapshot) => {
				const childPath = nodePath.join(path, snapshot.key);
				this.map.set(toDotPath(childPath));
				this.removeFromCollection(pathWithQueryString, snapshot.key);
			};

			// can this be the same handler as addedHandler?
			const changedHandler = (snapshot) => {
				const childPath = nodePath.join(path, snapshot.key);
				this.map.set(toDotPath(childPath), snapshot.exportVal());
			};

			const movedHandler = (snapshot, prevKey) => {
				this.removeFromCollection(pathWithQueryString, snapshot.key);
				this.addToCollection(pathWithQueryString, prevKey, snapshot.key);
			};

			ref.on('child_added', addedHandler);
			ref.on('child_removed', removedHandler);
			ref.on('child_changed', changedHandler);
			ref.on('child_moved', movedHandler);

			listener = observable({
				listeners: 1,
				destroy: () => {
					ref.off('child_added', addedHandler);
					ref.off('child_removed', removedHandler);
					ref.off('child_changed', changedHandler);
					ref.off('child_moved', movedHandler);
				}
			});

			this.listeners.set(pathWithQueryString, listener);
		}

		return () => {
			listener.listeners--;
			if(!listener.listeners){
				listener.destroy();
				this.listeners.set(pathWithQueryString);
			}
		}
	}

	addToCollection(pathWithQueryString, afterKey, key){
		let collection = this.collections.get(pathWithQueryString);
		if(!collection){
			collection = observable([]);
			this.collections.set(pathWithQueryString, collection);
		}

		const prevIndex = collection.indexOf(afterKey);
		collection.splice(prevIndex + 1, 0, key);
	}

	removeFromCollection(pathWithQueryString, key){
		let collection = this.collections.get(pathWithQueryString);
		collection.remove(key);
	}


	async load(path){
		this.setPathIsLoading(path, true);
		const snapshot = await this.database.ref(this.toAbsolutePath(path)).once('value');
		const snapshotVal = snapshot.exportVal();
		const dotPath = path.split('/').join('.');

		this.map.set(dotPath, snapshotVal);
		this.setPathIsLoading(path, false);
		return snapshotVal;
	}

	remove(path){
		return this.database.ref(this.toAbsolutePath(path)).remove();
	}


	clearCache(path){
		const dotPath = path.split('/').join('.');
		this.map.set(dotPath, null);
	}

	setPathStatus(path, status){
		const currentStatus = this.pathsStatus.get(path) || {};
		this.pathsStatus.set(path, {...currentStatus, ...status});
	}

	setPathIsLoading(path, state){
		const currentStatus = this.pathsStatus.get(path);
		if(!currentStatus || !state){
			this.setPathStatus(path, {isLoading: state});
		}
	}

	isPathLoading(path){
		const currentStatus = this.pathsStatus.get(path);
		return currentStatus && currentStatus.isLoading;
	}



}


const createRefWithOptions = (baseRef, options) => {
	let finalRef = baseRef;
	forEach(options, (value, key) => {
		finalRef = finalRef[key](value)
	});
	return finalRef;
};


const optionsToQueryString = options => map(options, (value, key) => key + '=' + value).join('&');




const toDotPath = slashPath => slashPath.split('/').join('.');