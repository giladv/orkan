import {observable, isObservable, toJS, computed, extendObservable} from 'mobx';
import {keyBy} from 'lodash';
import nodePath from 'path';

import {ObservableNestedMap} from './form/observable-nested-map';

export default class FirebaseStore{
	database;
	rootPath;
	@observable data = [];

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
		return this.database.ref(this.toAbsolutePath(path)).set(value);
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
		};

		this.database.ref(this.toAbsolutePath(path)).on('value', valueHandler);

		return () => {
			this.database.ref(this.toAbsolutePath(path)).off('value', valueHandler);
		};

	}



	async load(path){
		const snapshot = await this.database.ref(this.toAbsolutePath(path)).once('value');
		const snapshotVal = snapshot.exportVal();
		const dotPath = path.split('/').join('.');

		this.map.set(dotPath, snapshotVal);
		return snapshotVal;
	}

	remove(path){
		return this.database.ref(this.toAbsolutePath(path)).remove();
	}
}