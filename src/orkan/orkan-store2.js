import {isEmpty} from 'lodash';
import {observable, computed, toJS} from 'mobx';
import autobind from 'autobind-decorator';
import isObject from 'lodash/isObject';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import isEqualWith from 'lodash/isEqualWith';
import invariant from 'invariant';
import {breakPath, toDotPath, toQueryablePath} from './firestore';

import FormStore from './form/form-store';
import {
	COLLECTION_KEY, SCHEMA_KEY,
	SCHEMA_KEY_NAME,
	SCHEMA_PATH,
	SCHEMA_SETTINGS_KEY_NAME,
	SCHEMA_SETTINGS_PATH, SYSTEM_OBJECTS_KEY,
	USER_REQUESTS_KEY_NAME, USERS_KEY,
	USERS_KEY_NAME
} from './constants';
import {stripRootFromPath, toAbsolutePath} from './utils/path-utils';
import {getSchemaCollectionPaths, schemaGet, toSchemaPath} from './utils/schema-utils';

const validPathInvariant = path => invariant(path.startsWith('.'), 'Invalid path structure. paths must start with `.`');



export default class OrkanStore{
	dataStore;
	authStore;

	dataFormStore = new FormStore({}, {});
	settingsFormStore = new FormStore({}, {});

	@observable activePath;
	@observable settingsPath;

	@observable isLoadingActivePath = false;
	@observable isInitializing = true;

	@observable.ref user;

	@observable.ref modal;
	modalPromise;

	constructor(dataStore, authStore){
		this.dataStore = dataStore;
		this.authStore = authStore;

		window.s = () => toJS(this);
	}

	@computed get activePathWithoutRoot(){
		return stripRootFromPath(this.activePath);
	}

	init(){
		this.isInitializing = true;
		this.authStore.onAuthStateChanged(async user => {
			if(user){
				let userPermissions;
				try{
					userPermissions = await this.dataStore.load(USERS_KEY + '/' + user.uid);
				}catch(err){console.log(err)}

				if(userPermissions){
					this.user = user;
					this.dataStore.listen(SCHEMA_PATH);
					this.dataStore.listen(SCHEMA_SETTINGS_PATH);
				}else{
					await this.createUserRequest(user);
					this.logout()
				}
			}else{
				this.user = null;
			}
			this.isInitializing = false;
		});
	}

	logout(){
		this.dataStore.clearCache(USERS_KEY);
		this.dataStore.clearCache(SCHEMA_PATH);
		this.dataStore.clearCache(SCHEMA_SETTINGS_PATH);
		return this.authStore.signOut();
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

	/*

		# use cases where we return the plain FB value

		// something isn't loaded yet
		// none of below conditions meet


		# use cases where we need to merge the value with dataFormStore

		// case #1 child of path in any level is being edited
		path: hero
		activePath: hero/cta or hero/cta/label
		- solution: merge form data into FB data and return

		// case #2 primitive path direct parent is being edited
		path: hero/title
		activePath: hero
		- solution: pick the field from the form and return

		//  case #3 path is being edited
		path: hero/title
		activePath: hero/title
		- solution: pick the field from the form and return

	*/

	getValue(anyTypeOfPath, options){
		// to enable components use relative paths (e.g something vs ./something)
		const path = toAbsolutePath(anyTypeOfPath);

		if(!this.activePath || this.isInitializing || this.dataStore.isLoading(SCHEMA_KEY_NAME) || this.isLoadingActivePath){
			return this.dataStore.getValue(stripRootFromPath(anyTypeOfPath), options);
		}

		if(this.activePath === path){
		// case #3
		console.log('@case #3', path);

			if(this.isPathPrimitive(path, true)){
				return this.dataFormStore.get(this.activePath)
			}else if(this.isPathCollection(path)){
				return this.dataStore.getValue(stripRootFromPath(anyTypeOfPath), options);
			}else{
				return {
					...this.dataStore.getValue(stripRootFromPath(anyTypeOfPath), options),
					...this.dataFormStore.get(this.activePath)
				};
			}

		}else if(path.startsWith(this.activePath) && this.isPathPrimitive(path, true)){
		// case #2
		console.log('@case #2', path);

			const relativePath = path.replace(this.activePath + '/', '');
			const relativePathParts = relativePath.split('/');

			const isPathDeeplyNested = relativePathParts.length > 1;

			if(isPathDeeplyNested){
				return this.dataStore.getValue(stripRootFromPath(anyTypeOfPath), options);
			}else{
				const formValue = this.dataFormStore.get(this.activePath);
				return formValue && formValue[relativePathParts[0]];
			}

		}else if(this.activePath.startsWith(path)){
		// case #1
		console.log('@case #1', path);

			const dataStoreValue = this.dataStore.getValue(stripRootFromPath(anyTypeOfPath), options);
			let clonedData = cloneDeep(dataStoreValue);
			if(Array.isArray(dataStoreValue)){
				const pathParts = this.activePath.replace(path + '/', '').split('/');
				const firstKey = pathParts.shift();
				const collectionItem = clonedData.find(item => item.$key === firstKey);
				if(collectionItem){
					const propertyToOverride = pathParts.length?get(collectionItem, pathParts):collectionItem;

					// if propertyToOverride is an empty collection it will be undefined so we need to make sure
					propertyToOverride && Object.assign(propertyToOverride, this.dataFormStore.get(this.activePath));
					return clonedData;
				}else{
					return dataStoreValue;
				}
			}else{
				const propertyToOverride = get(clonedData, this.activePath.replace(path + '/', '').split('/'));

				// if propertyToOverride is an empty collection it will be undefined so we need to make sure
				propertyToOverride && Object.assign(propertyToOverride, this.dataFormStore.get(this.activePath));
				return clonedData
			}

		}else{
			return this.dataStore.getValue(stripRootFromPath(anyTypeOfPath), options);
		}
	}

	async setActivePath(anyTypeOfPath){
		// to enable components use relative paths (e.g something vs ./something)
		const path = toAbsolutePath(anyTypeOfPath);

		this.activePath = path;
		this.dataFormStore.reset();

		if(path === '.'){
			return;
		}

		this.isLoadingActivePath = true;
		path !== '.' && await this.loadRequiredFieldsByPath(path);
		this.isLoadingActivePath = false;
		const storeValue = this.dataStore.getValue(stripRootFromPath(anyTypeOfPath)) || {};

		if(this.isPathPrimitive(path, true)){
			this.dataFormStore.set(path, storeValue);
		}else if(!this.isPathCollection(path)){
			this.getPrimitiveKeysByPath(path, true).forEach(key => {
				this.dataFormStore.set(`${path}.${key}`, storeValue[key]);
			});
		}

		setTimeout(() => this.dataFormStore.setClean(), 2);
	}

	async submitData(){
		const queryablePath = toQueryablePath(this.activePathWithoutRoot);
		const {innerPath} = breakPath(this.activePathWithoutRoot);
		const newValue = this.dataFormStore.get(this.activePath);
		const currentValueClone = cloneDeep(this.dataStore.getValue(queryablePath));
		set(currentValueClone, toDotPath(innerPath), newValue);

		await this.dataStore.setValue(queryablePath, currentValueClone);

		setTimeout(() => this.dataFormStore.setClean(), 2);
	}

	async loadRequiredFieldsByPath(path){
		const pathWithoutHome = stripRootFromPath(path);
		if(this.isPathPrimitive(path, true)){
			return await this.dataStore.load(pathWithoutHome);
		}else if(!this.isPathCollection(path)){
			return await Promise.all(this.isPathCollection(path)?[]:this.getPrimitiveKeysByPath(path, true)
				.filter(key => this.dataStore.getValue(pathWithoutHome + '/' + key) === undefined)
				.map(key => this.dataStore.load(pathWithoutHome + '/' + key))
			);
		}
	}

	toSchemaPath(path){
		validPathInvariant(path);
		const schema = this.getSchema(true);
		return toSchemaPath(schema, path);
	}

	getSchemaByPath(path, includeNative){
		validPathInvariant(path);
		const schema = this.getSchema(includeNative);
		const schemaPath = toSchemaPath(schema, path);
		return schemaPath && schemaGet(schema, schemaPath);
	}

	isSchemaCompatible(path, toPath){
		const pathSchema = this.getSchemaByPath(path);
		const toPathSchema = this.getSchemaByPath(toPath);
		return isSchemaCompatible(pathSchema, toPathSchema);
	}

	isPathPrimitive(path, includeNative){
		validPathInvariant(path);
		const pathSchema = this.getSchemaByPath(path, includeNative);
		return !isObject(pathSchema);

	}

	getPrimitiveKeysByPath(path, includeNative){
		validPathInvariant(path);

		const pathSchema = this.getSchemaByPath(path, includeNative);
		return !pathSchema?[]:Object.keys(pathSchema)
			.filter(key => !isObject(pathSchema[key]))
	}

	getNonPrimitiveKeysByPath(path, includeNative){
		validPathInvariant(path);
		const pathSchema = this.getSchemaByPath(path, includeNative);

		if(this.isPathCollection(path)){
			return Object.keys(this.dataStore.getValue(stripRootFromPath(path)) || {})
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
		validPathInvariant(path);
		const schema = this.getSchema(true);
		const schemaSettings = this.getSchemaSettings(true);

		const schemaPath = toSchemaPath(schema, path);
		if(schemaPath === this.settingsPath){
			return this.settingsFormStore.toJS();
		}else if(schemaSettings){
			return schemaGet(schemaSettings, schemaPath);
		}
	}

	async submitSettings(){
		const newValue = this.settingsFormStore.toJS();
		const schemaSettingsClone = cloneDeep(this.getSchemaSettings());
		set(schemaSettingsClone, toDotPath(stripRootFromPath(this.settingsPath)), newValue);
		await this.dataStore.setValue(SCHEMA_SETTINGS_PATH, schemaSettingsClone);

		this.clearSettingsPath();
	}


	setSettingsPath(path){
		validPathInvariant(path);

		this.settingsPath = this.toSchemaPath(path);
		const defaultSettings = this.isPathCollection(path)?defaultCollectionSettings:defaultPrimitiveSettings;
		this.settingsFormStore.reset({...defaultSettings, ...this.getSettingsByPath(path)});
	}

	isPathCollection(path){
		const subSchema = this.getSchemaByPath(path, true);
		return subSchema && Array.isArray(subSchema);
	}

	async createCollectionItem(path, key){
		validPathInvariant(path);

		const finalKey = key || this.dataStore.push(this.activePathWithoutRoot).key;
		this.setActivePath(path + '/' + finalKey);
	}


	removeCollectionItem(path){
		validPathInvariant(path);
		return this.dataStore.remove(stripRootFromPath(path));
	}

	getSchema(includeNative = false){
		return {
			...this.dataStore.getValue(SCHEMA_PATH),
			...includeNative?orkanSchema:{}
		};
	}

	getSchemaSettings(includeNative = false){
		return {
			...this.dataStore.getValue(SCHEMA_SETTINGS_PATH),
			...includeNative?orkanSchemaSettings:{}
		};
	}

	getUserPermissions(){
		return this.dataStore.getValue(USERS_KEY_NAME + '/' + this.user.uid);
	}

	getCollectionSchemaPaths(includeNative){
		return getSchemaCollectionPaths(this.getSchema(includeNative));
	}

	/*
		0: "./blog/posts"
		1: "./docs/categories"
		2: "./docs/categories/_/pages"
		3: "./home/examples/list"
		4: "./home/features/list"
		5: "./menu"


	*/
	getCollectionPaths(includeNative){
		const collectionSchemaPaths = this.getCollectionSchemaPaths(includeNative);
		collectionSchemaPaths.map(path => {
			if(!path.includes('/' + COLLECTION_KEY + '/')){
				return path;
			}

			const pathParts = path.split()

		})
	}

	getPathsFromSchemaPaths(schemaPaths){
		schemaPaths.map(schemaPath => {
			if(!schemaPath.includes('/' + COLLECTION_KEY + '/')){
				return schemaPath;
			}

			const pathParts = schemaPath.split()

		})
	}

	async approveUserRequest(uid){
		const userRequest = this.dataStore.getValue(USER_REQUESTS_KEY_NAME + '/'	+ uid);
		await this.dataStore.remove(USER_REQUESTS_KEY_NAME + '/'	+ uid);
		await this.dataStore.setValue(USERS_KEY_NAME + '/'	+ uid, {...userRequest, ...defaultUserPermissions});
	}


	declineUserRequest(uid){
		return this.dataStore.remove(USER_REQUESTS_KEY_NAME + '/'	+ uid);
	}

	openModal(Component, props = {}){
		return new Promise((resolve, reject) => {
			this.rejectModal = (...args) => {
				this.modal = null;
				this.rejectModal = null;
				reject(...args);
			};

			this.modal = {
				Component,
				props: {
					...props,
					resolve: (...args) => {
						this.modal = null;
						resolve(...args);
					},
					reject: this.rejectModal
				}
			};
		});
	}

	clearModal(){
		this.rejectModal && this.rejectModal();
	}
}





const orkanSchema = {
	[SYSTEM_OBJECTS_KEY]: {
		[SCHEMA_KEY]: {},
	},
	[USERS_KEY]: [
		{
			editData: true,
			editPermissions: true,
			editSchema: true,
		}
	]
};


const orkanSchemaSettings = {
	[USERS_KEY]: [
		{
			editData: {
				uiType: 'switch'
			},
			editPermissions: {
				uiType: 'switch'
			},
			editSchema: {
				uiType: 'switch'
			}
		},
		{
			labelField: 'email',
			imageField: 'avatarUrl'
		}
	]
};


const defaultUserPermissions = {
	editData: true
};


const defaultPrimitiveSettings = {
	uiType: 'text'
};

const defaultCollectionSettings = {
	labelField: ''
};



const isSchemaCompatible = (schema, toSchema) => {
	const schemaKeys = Object.keys(schema)
	return !schemaKeys.find(key => {
		if(typeof schema[key] !== typeof toSchema[key]){
			return true;
		}
		if(isObject(schema[key])){
			return !isSchemaCompatible(schema[key], toSchema[key]);
		}else{
			return schema[key] !== toSchema[key];
		}
	});
};



/*

	# schema
	{
		objects; {
			home: {
				features: {
					title,
					list: [{
						title, body, img
					}]
				}
			}
		}
		docs; [{
			title, body
		}]

	}

	# schema settings
	{
		objects__home__features__title: {uiTypes}
		objects__home__features__list: {uiTypes}
		objects__home__features__list__: {uiTypes}
	}

	{
		objects: {
			home: {
				features: {
					title: {uiType}
					list: {
						$settings: {
							labelField,
							imageField,
						}
						title: {uiTypes}
						body: {uiTypes}
						img: {uiTypes}
					}

					list: [
						{
							title: {uiTypes}
							body: {uiTypes}
							img: {uiTypes}
						},
						{
							labelField,
							imageField,
						}
					]
				}
			}
		}
	}




*/