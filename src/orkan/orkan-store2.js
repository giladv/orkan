import {isEmpty} from 'lodash';
import {observable, computed, toJS} from 'mobx';
import isObject from 'lodash/isObject';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import omitBy from 'lodash/omitBy';
import invariant from 'invariant';
import {breakPath, toDotPath, toQueryablePath} from './firestore';

import FormStore from './form/form-store';
import {
	SCHEMA_KEY,
	SCHEMA_PATH,
	SCHEMA_SETTINGS_PATH,
	SYSTEM_OBJECTS_KEY, USER_REQUESTS_KEY,
	USERS_KEY
} from './constants';
import {getParentPath, stripRootFromPath, toAbsolutePath} from './utils/path-utils';
import {getSchemaIterablePaths, schemaGet, toSchemaPath} from './utils/schema-utils';

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
	@observable isInvitationSent = false;

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

	// tested
	init(){
		return new Promise((resolve, reject) => {
			this.isInitializing = true;
			this.authStore.onAuthStateChanged(async firebaseUser => {
				if(firebaseUser){
					let orkanUser;
					try{
						orkanUser = await this.dataStore.load(USERS_KEY + '/' + firebaseUser.uid);
					}catch(err){console.log(err)}
					if(orkanUser){
						this.user = orkanUser;
						await this.dataStore.load(SCHEMA_PATH);
						await this.dataStore.load(SCHEMA_SETTINGS_PATH);
						this.dataStore.listen(SCHEMA_PATH);
						this.dataStore.listen(SCHEMA_SETTINGS_PATH);
					}else{
						this.isInvitationSent = true;
						await this.createUserRequest(firebaseUser);
						this.logout()
					}
				}else{
					this.user = null;
				}
				this.isInitializing = false;
				resolve();
			});
		});
	}

	// tested
	logout(){
		this.dataStore.clearCache(USERS_KEY);
		this.dataStore.clearCache(SCHEMA_PATH);
		this.dataStore.clearCache(SCHEMA_SETTINGS_PATH);
		this.user = null;
		return this.authStore.signOut();
	}

	// tested
	isAdmin(){
		return !!this.user;
	}

	// tested
	createUserRequest(firebaseUser){
		return this.dataStore.setValue(USER_REQUESTS_KEY + '/' + firebaseUser.uid, {
			email: firebaseUser.email,
			avatarUrl: firebaseUser.photoURL
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

		if(!this.activePath || this.isInitializing || this.dataStore.isLoading(SCHEMA_KEY) || this.isLoadingActivePath){
			return this.dataStore.getValue(stripRootFromPath(anyTypeOfPath), options);
		}

		if(this.activePath === path){
		// case #3
		console.log('@case #3', path);

			if(this.isPathCollection(path)){
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
				const isPathCollection = this.isPathCollection(anyTypeOfPath);

				let collectionItem;
				if(isPathCollection){
					collectionItem = clonedData.find((item, key) => item.$key === firstKey);
				}else{
					collectionItem = clonedData[firstKey];
				}


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


	// tested
	async setActivePath(anyTypeOfPath){
		// to enable components use relative paths (e.g something vs ./something)
		const path = toAbsolutePath(anyTypeOfPath);

		this.activePath = this.isPathPrimitive(path, true)?getParentPath(path):path;

		this.dataFormStore.reset();

		if(path === '.'){
			return;
		}

		this.isLoadingActivePath = true;
		await this.loadRequiredFieldsByPath(this.activePath);
		this.isLoadingActivePath = false;
		const storeValue = this.dataStore.getValue(stripRootFromPath(this.activePath)) || {};

		if(!this.isPathCollection(this.activePath)){

			this.getPrimitiveKeysByPath(this.activePath, true).forEach(key => {
				this.dataFormStore.set(`${this.activePath}.${key}`, storeValue[key]);
			});
		}

		setTimeout(() => this.dataFormStore.setClean(), 2);
	}

	async submitData(){
		const queryablePath = toQueryablePath(this.activePathWithoutRoot);
		const {innerPath} = breakPath(this.activePathWithoutRoot);

		const formValue = omitBy(this.dataFormStore.get(this.activePath), val => !val);
		const currentValue = this.dataStore.getValue(stripRootFromPath(this.activePath)) || {};
		const finalValue = {...currentValue, ...formValue};

		let document = cloneDeep(this.dataStore.getValue(queryablePath) || {});

		if(innerPath){
			set(document, toDotPath(innerPath), finalValue);
		}else{
			Object.assign(document, finalValue);
		}

		await this.dataStore.setValue(queryablePath, document);
		setTimeout(() => this.dataFormStore.setClean(), 2);
	}

	// tested
	async loadRequiredFieldsByPath(path){
		const pathWithoutHome = stripRootFromPath(path);
		if(!this.isPathCollection(path)){
			return await Promise.all(this.getPrimitiveKeysByPath(path, true)
				.filter(key => this.dataStore.getValue(pathWithoutHome + '/' + key) === undefined)
				.map(key => this.dataStore.load(pathWithoutHome + '/' + key))
			);
		}
	}

	// tested
	toSchemaPath(path){
		validPathInvariant(path);
		const schema = this.getSchema(true);
		return toSchemaPath(schema, path);
	}

	// tested
	getSchemaByPath(path, includeNative){
		validPathInvariant(path);
		const schema = this.getSchema(includeNative);
		const schemaPath = toSchemaPath(schema, path);
		return schemaPath && schemaGet(schema, schemaPath);
	}

	// tested
	isPathPrimitive(path, includeNative){
		validPathInvariant(path);
		const pathSchema = this.getSchemaByPath(path, includeNative);
		return !isObject(pathSchema);
	}

	// tested
	getPrimitiveKeysByPath(path, includeNative){
		validPathInvariant(path);

		const pathSchema = this.getSchemaByPath(path, includeNative);
		return !pathSchema?[]:Object.keys(pathSchema)
			.filter(key => !isObject(pathSchema[key]))
	}

	// tested
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

	// tested
	clearActivePath(){
		this.activePath = null;
		this.dataFormStore.reset();
		this.clearSettingsPath();
	}

	// tested
	clearSettingsPath(){
		this.settingsFormStore.reset();
		this.settingsPath = null;
	}

	// tested
	getLiveSettingsByPath(path){
		validPathInvariant(path);

		const schemaPath = this.toSchemaPath(path);

		if(!schemaPath){
			return;
		}

		if(schemaPath === this.settingsPath){
			return this.settingsFormStore.toJS();
		}else{
			return this.getSettingsByPath(path)
		}
	}

	// tested
	getSettingsByPath(path){
		validPathInvariant(path);

		const schemaSettings = this.getSchemaSettings(true);

		const schemaPath = this.toSchemaPath(path);

		if(!schemaPath){
			return;
		}

		const pathSchemaSettings = schemaGet(schemaSettings, schemaPath);
		return this.isPathIterable(path) &&  pathSchemaSettings?pathSchemaSettings[1]:pathSchemaSettings;

	}

	// tested
	async submitSettings(){
		const newValue = this.settingsFormStore.toJS();
		const schemaSettingsClone = cloneDeep(this.getSchemaSettings());


		if(this.isPathIterable(this.settingsPath)){
			const pathSchemaSettings = get(schemaSettingsClone, toDotPath(stripRootFromPath(this.settingsPath))) || [];
			pathSchemaSettings[0] = pathSchemaSettings[0] || {};
			pathSchemaSettings[1] = newValue;
			set(schemaSettingsClone, toDotPath(stripRootFromPath(this.settingsPath)), pathSchemaSettings);
		}else{
			set(schemaSettingsClone, toDotPath(stripRootFromPath(this.settingsPath)), newValue);
		}

		await this.dataStore.setValue(SCHEMA_SETTINGS_PATH, schemaSettingsClone);
		this.clearSettingsPath();
	}

	// tested
	setSettingsPath(path){
		validPathInvariant(path);

		this.settingsPath = this.toSchemaPath(path);
		const isPathIterable = this.isPathIterable(path);

		const defaultSettings = isPathIterable?defaultCollectionSettings:defaultPrimitiveSettings;
		this.settingsFormStore.reset({...defaultSettings, ...this.getSettingsByPath(path)});
	}

	// tested
	isPathIterable(path){
		return this.isPathCollection(path) || this.isPathArray(path);
	}

	// tested
	isPathCollection(path){
		const pathParts = path.split('/');

		if(pathParts.length !== 2){
			return false;
		}

		const subSchema = this.getSchemaByPath(path, true);
		return subSchema && Array.isArray(subSchema);
	}

	// tested
	isPathArray(path){
		const pathParts = path.split('/');

		if(pathParts.length <= 2){
			return false;
		}

		const subSchema = this.getSchemaByPath(path, true);
		return subSchema && Array.isArray(subSchema);
	}

	async createCollectionItem(path, key){
		validPathInvariant(path);

		const finalKey = key || this.dataStore.generateKey(stripRootFromPath(path));
		this.setActivePath(path + '/' + finalKey);
	}


	createArrayItem(path){
		validPathInvariant(path);
		const arr = this.dataStore.getValue(stripRootFromPath(path)) || [];
		this.setActivePath(path + '/' + arr.length);
	}


	removeCollectionItem(path){
		validPathInvariant(path);
		return this.dataStore.remove(stripRootFromPath(path));
	}

	// tested
	getSchema(includeNative = false){
		return {
			...this.dataStore.getValue(SCHEMA_PATH),
			...includeNative?orkanSchema:{}
		};
	}

	// tested
	getSchemaSettings(includeNative = false){
		return {
			...this.dataStore.getValue(SCHEMA_SETTINGS_PATH),
			...includeNative?orkanSchemaSettings:{}
		};
	}

	// tested
	getIterableSchemaPaths(includeNative){
		return getSchemaIterablePaths(this.getSchema(includeNative));
	}


	// tested
	async approveUserRequest(uid){
		const userRequest = this.dataStore.getValue(USER_REQUESTS_KEY + '/'	+ uid);
		if(userRequest){
			await this.dataStore.remove(USER_REQUESTS_KEY + '/'	+ uid);
			await this.dataStore.setValue(USERS_KEY + '/'	+ uid, {...userRequest, ...defaultUserPermissions});
		}
	}

	// tested
	declineUserRequest(uid){
		return this.dataStore.remove(USER_REQUESTS_KEY + '/'	+ uid);
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
			collectionMainLabel: 'email',
			collectionImage: 'avatarUrl'
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
	// collectionMainLabel: ''
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




{
	objects: {
		type: 'object',
		children: {
			home: {
				type: 'object',
				children: {
					features: {
						type: 'object',
						children: {
							list: {
								type: 'array',
								of: {
									type: 'object'
									children: {..}
								}
							}
						}
					}
				}
			}
		}
	}
	docs: {

	}
}


#### create the entire changed document from the root and then merge it


*/