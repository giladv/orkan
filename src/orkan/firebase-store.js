import omitBy from 'lodash/omitBy';
import {observable, isObservable, toJS} from 'mobx';
import nodePath from 'path';

import {ObservableNestedMap} from './form/observable-nested-map';

export default class FirebaseStore{
	database;
	rootPath;

	pathsStatus = observable.map({});

	map = new ObservableNestedMap({});


	constructor(database, rootPath = 'orkan'){
		this.database = database;
		this.rootPath = rootPath;
	}

	toAbsolutePath(path){
		return nodePath.join(this.rootPath, path);
	}

	getValue(path){
		const value = this.map.get(path.split('/').join('.'));
		return isObservable(value)?toJS(value):value;
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
		this.database.ref(this.toAbsolutePath(path)).on('value', valueHandler);

		return () => {
			this.database.ref(this.toAbsolutePath(path)).off('value', valueHandler);
		};

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