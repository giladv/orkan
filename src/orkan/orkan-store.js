import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import isObject from 'lodash/isObject';

import FormStore from './form/form-store';
import {SCHEMA_KEY_NAME, SCHEMA_SETTINGS_KEY_NAME, USER_REQUESTS_KEY_NAME, USERS_KEY_NAME} from './constants';
import {getSchemaPrimitiveKeysByPath, schemaGet, toSchemaPath} from './utils/schema-utils';


const toAbsolutePath = path => {
	let pathParts = path.split('/');
	if(pathParts[0] !== '.'){
		pathParts.unshift('.');
	}

	return pathParts.join('/');
};

export default class OrkanStore{
	dataStore;
	authStore;

	dataFormStore = new FormStore({}, {});
	settingsFormStore = new FormStore({}, {});

	@observable activePath;
	@observable settingsPath;

	@observable isLoadingActivePath = false;
	@observable isInitiating = false;

	@observable.ref user;

	constructor(dataStore, authStore){
		this.dataStore = dataStore;
		this.authStore = authStore;
	}

	init(){
		this.isInitiating = true;
		this.authStore.onAuthStateChanged(async user => {
			if(user){
				let userPermissions;
				try{
					userPermissions = await this.dataStore.load(USERS_KEY_NAME + '/' + user.uid);
				}catch(err){}

				if(userPermissions){
					this.user = user;
					this.dataStore.listen(SCHEMA_KEY_NAME);
					this.dataStore.listen(SCHEMA_SETTINGS_KEY_NAME);
				}else{
					await this.createUserRequest(user);
					auth.signOut();
				}
			}else{
				this.user = null;
			}
			this.isInitiating = false;
		});
	}

	isAdmin(){
		return !!this.user;
	}


	createUserRequest(user){
		return this.dataStore.setValue(USER_REQUESTS_KEY_NAME + '/' + user.uid, {
			email: user.email,
			avatarUrl: user.photoURL
		});
	}

	getValue(path){
		// to enable components use relative paths (e.g something vs ./something)
		path = toAbsolutePath(path);

		if(this.isLoadingActivePath){
			return this.dataStore.getValue(path);
		}

		if(this.activePath === path){
			return this.dataFormStore.get(this.activePath) || this.dataStore.getValue(path);
		}else if(this.activePath && this.activePath.indexOf(path) === 0){
			return {
				...this.dataStore.getValue(path),
				[this.activePath.replace(path + '/', '')]: this.dataFormStore.get(this.activePath) || this.dataStore.getValue(this.activePath)
			};
		}else if(!this.isSchemaPathPrimitive(path)){
			return this.dataStore.getValue(path);
		}else if(this.activePath && path.indexOf(this.activePath) === 0){

			const relativePath = path.replace(this.activePath, '');
			let relativePathParts = relativePath.split('/');
			relativePathParts.shift(); // removing the first item because its empty

			if(relativePathParts.length === 1){
				const formValue = this.dataFormStore.get(this.activePath);
				return formValue && formValue[relativePathParts[0]];
			}else{
				return this.dataStore.getValue(path);
			}

		}else{
			return this.dataStore.getValue(path);
		}

	}

	async setActivePath(path){
		// to enable components use relative paths (e.g something vs ./something)
		path = toAbsolutePath(path);

		this.activePath = path;
		this.dataFormStore.reset();

		this.isLoadingActivePath = true;
		await this.loadRequiredFieldsByPath(path);
		this.isLoadingActivePath = false;
		const storeValue = this.dataStore.getValue(path) || {};

		if(!this.isSchemaPathPrimitive(path)){
			this.getPrimitiveKeysByPath(path).forEach(key => {
				this.dataFormStore.set(`${path}.${key}`, storeValue[key]);
			});
		}else{
			this.dataFormStore.set(path, this.dataStore.getValue(path));
		}

		setTimeout(() => this.dataFormStore.setClean(), 2);
	}

	async submitData(){
		const newValue = this.dataFormStore.get(this.activePath);
		const currentValue = this.dataStore.getValue(this.activePath);


		if(isObject(newValue) && isObject(currentValue)){
			await this.dataStore.setValue(this.activePath, {...currentValue, ...newValue});
		}else{
			await this.dataStore.setValue(this.activePath, newValue);
		}

		setTimeout(() => this.dataFormStore.setClean(), 2);
	}

	loadRequiredFieldsByPath(path){
		return Promise.all(this.getPrimitiveKeysByPath(path)
			.filter(key => this.dataStore.getValue(path + '/' + key) === undefined)
			.map(key => this.dataStore.load(path + '/' + key))
		);
	}


	getSchemaByPath(path){
		const schema = this.getSchema();
		return schemaGet(schema, path);
	}

	isSchemaPathPrimitive(path){
		const pathSchema = this.getSchemaByPath(path);
		return !isObject(pathSchema);

	}

	getPrimitiveKeysByPath(path){
		const schema = this.getSchema();
		return getSchemaPrimitiveKeysByPath(schema, path);
	}

	geNonPrimitiveKeysByPath(path){
		const pathSchema = this.getSchemaByPath(path);

		if(pathSchema._){
			return Object.keys(this.dataStore.getValue(path) || {})
		}else{
			return Object.keys(pathSchema)
				.filter(key => isObject(pathSchema[key]))
		}
	}

	clearActivePath(){
		this.activePath = null;
		this.dataFormStore.reset();
		this.clearSettingsPath();
	}

	clearSettingsPath(){
		this.settingsFormStore.reset();
		this.settingsPath = null;
	}

	getSettingsByPath(path){
		const schema = this.getSchema();
		const schemaSettings = this.getSchemaSettings();

		const schemaPath = toSchemaPath(schema, path);

		if(schemaPath === this.settingsPath){
			return this.settingsFormStore.toJS();
		}else if(schemaSettings){
			return schemaGet(schemaSettings, schemaPath);
		}
	}

	async submitSettings(){
		const newValue = this.settingsFormStore.toJS();

		await this.dataStore.setValue(SCHEMA_SETTINGS_KEY_NAME + '/' + this.settingsPath, newValue);

		this.clearSettingsPath();
	}


	setSettingsPath(path){
		const schema = this.getSchema();
		const schemaSettings = this.getSchemaSettings();

		const schemaPath = toSchemaPath(schema, path);
		this.settingsPath = schemaPath;

		const defaultSettings = {
			uiType: 'text'
		};

		this.settingsFormStore.reset(schemaGet(schemaSettings, schemaPath) || defaultSettings);
	}

	// todo: how do i create a premitive collection item?
	async createCollectionItem(key){
		if(key){
			this.dataStore.setValue(this.activePath + '/' + key, {});
			this.setActivePath(this.activePath + '/' + key);
		}else{
			const newKey = this.dataStore.push(this.activePath).key;
			this.setActivePath(this.activePath + '/' + newKey);
		}
	}


	removeCollectionItem(key){
		return this.dataStore.remove(this.activePath + '/' + key);
	}

	getSchema(){
		return {
			...this.dataStore.getValue(SCHEMA_KEY_NAME),
			...orkanSchema
		};
	}

	getSchemaSettings(){
		return {
			...this.dataStore.getValue(SCHEMA_SETTINGS_KEY_NAME),
			...orkanSchemaSettings
		};
	}

	getUserPermissions(){
		return this.dataStore.getValue(USERS_KEY_NAME + '/' + this.user.uid);
	}

	async approveUserRequest(uid){
		await this.dataStore.remove(USER_REQUESTS_KEY_NAME + '/'	+ uid);
		await this.dataStore.setValue(USERS_KEY_NAME + '/'	+ uid, defaultUserPermissions);
	}


	declineUserRequest(uid){
		return this.dataStore.remove(USER_REQUESTS_KEY_NAME + '/'	+ uid);
	}
}




const orkanSchema = {
	usersPermissions: {
		_: {
			editData: 'string',
			editPermissions: 'string',
			editSchema: 'string',
		}
	}
};


const orkanSchemaSettings = {
	usersPermissions: {
		_: {
			editData: {
				uiType: 'checkbox'
			},
			editPermissions: {
				uiType: 'checkbox'
			},
			editSchema: {
				uiType: 'checkbox'
			}
		}
	}
};


const defaultUserPermissions = {
	editData: true
};
