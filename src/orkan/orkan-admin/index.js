import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import Sidebar from '../sidebar';
import OrkanDataForm from '../orkan-data-form';
import OrkanSettingsPanel from '../orkan-settings-panel';
import OrkanHeader from '../orkan-header';
import {getSchemaCollectionPaths} from '../utils/schema-utils';
import {keyboard, onDoublePress} from '../utils/keyboard-utils';
import OrkanAuth from '../orkan-auth';
import OrkanSpinner from '../orkan-spinner';
import OrkanPaths from '../orkan-paths';
import Img from '../img';
import OrkanUsersRequests from '../orkan-users-requests';
import OrkanStore from '../orkan-store';

import './style.scss';





@observer
export default class OrkanProvider extends Component{

	static propTypes = {
		store: PropTypes.instanceOf(OrkanStore).isRequired
	};


	@observable obState = {
		// activePath: null,
		// settingsPath: null,
		isActive: true,
		isEditMode: false,
		// isAuthOpen: true,
		// isLoading: false,
		isResizing: false
	};

	// @observable.ref user = null;

	componentWillMount(){
		const {store} = this.props;

		store.init();
		window.b = store
		// this.formStore = new FormStore({}, {});

		// this.settingsFormStore = new FormStore({}, {});

		// store.listen(SCHEMA_KEY_NAME);
		// store.listen(SCHEMA_SETTINGS_KEY_NAME);

		document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);

		// does not fire with normal api
		document.body.onblur = this.handleBlur;



		// keyboard.bind('hold:1000:o', (e, elapsed) => {
		// 	this.obState.isActive = true;
		// });

		keyboard.bind('escape', () => {
			store.activePath && store.clearActivePath();
		});

		onDoublePress('shift', () => {
			!store.activePath && store.setActivePath('.');
		});



		// auth.onAuthStateChanged(async user => {
		// 	if(user){
		// 		let userPermissions;
		// 		try{
		// 			userPermissions = await store.load(USERS_KEY_NAME + '/' + user.uid);
		// 		}catch(err){
		//
		// 		}
		//
		// 		if(userPermissions){
		// 			this.user = user;
		// 		}else{
		// 			await store.setValue(USER_REQUESTS_KEY_NAME + '/' + user.uid, {email: user.email, avatarUrl: user.photoURL});
		// 			auth.signOut();
		// 		}
		// 	}else{
		// 		this.user = null;
		// 	}
		// });


		window.lo = () => auth.signOut();


	}

	@autobind
	isEditMode(){
		return this.obState.isEditMode;
	}

	@autobind
	isAdmin(){
		return !!this.user;
	}

	@autobind
	isActive(){
		return this.obState.isActive;
	}


	@autobind
	handleBlur(e){
		this.obState.isEditMode = false;
	}


	@autobind
	handleKeyDown(e){
		if(e.key === 'Meta'){
			this.obState.isEditMode = true;
		}
	}

	@autobind
	handleKeyUp(e){
		if(e.key === 'Meta'){
			this.obState.isEditMode = false;
		}
	}

	// @autobind
	// getValue(path){
	// 	const {store} = this.props;
	// 	const {activePath, isLoading} = this.obState;
	//
	// 	// to enable components use relative paths (e.g something vs ./something)
	// 	path = toAbsolutePath(path);
	//
	// 	if(isLoading){
	// 		return store.getValue(path);
	// 	}
	//
	// 	if(activePath === path){
	// 		return this.formStore.get(activePath) || store.getValue(path);
	// 	}else if(activePath && activePath.indexOf(path) === 0){
	// 		return {
	// 			...store.getValue(path),
	// 			[activePath.replace(path + '/', '')]: this.formStore.get(activePath) || store.getValue(activePath)
	// 		};
	// 	}else if(!this.isSchemaPathPrimitive(path)){
	// 		return store.getValue(path);
	// 	}else if(activePath && path.indexOf(activePath) === 0){
	//
	// 		const relativePath = path.replace(activePath, '');
	// 		let relativePathParts = relativePath.split('/');
	// 		relativePathParts.shift(); // removing the first item because its empty
	//
	// 		if(relativePathParts.length === 1){
	// 			const formValue = this.formStore.get(activePath);
	// 			return formValue && formValue[relativePathParts[0]];
	// 		}else{
	// 			return store.getValue(path);
	// 		}
	//
	// 	}else{
	// 		return store.getValue(path);
	// 	}
	//
	// }
	//
	// @autobind
	// async setActivePath(path){
	// 	const {store} = this.props;
	//
	// 	// to enable components use relative paths (e.g something vs ./something)
	// 	path = toAbsolutePath(path);
	//
	// 	this.obState.activePath = path;
	// 	this.formStore.reset();
	//
	// 	this.obState.isLoading = true;
	// 	await this.loadRequiredFieldsByPath(path);
	// 	this.obState.isLoading = false;
	// 	const storeValue = store.getValue(path) || {};
	//
	// 	if(!this.isSchemaPathPrimitive(path)){
	// 		this.getPrimitiveKeysByPath(path).forEach(key => {
	// 			this.formStore.set(`${path}.${key}`, storeValue[key]);
	// 		});
	// 	}else{
	// 		this.formStore.set(path, store.getValue(path));
	// 	}
	//
	// 	setTimeout(() => this.formStore.setClean(), 2);
	//
	//
	// }

	// @autobind
	// async handleSubmit(){
	// 	const {store} = this.props;
	// 	const {activePath} = this.obState;
	// 	const newValue = this.formStore.get(activePath);
	// 	const currentValue = store.getValue(activePath);
	//
	//
	// 	if(isObject(newValue) && isObject(currentValue)){
	// 		await store.setValue(activePath, {...currentValue, ...newValue});
	// 	}else{
	// 		await store.setValue(activePath, newValue);
	// 	}
	//
	// 	setTimeout(() => this.formStore.setClean(), 2);
	// }
	//
	// loadRequiredFieldsByPath(path){
	// 	const {store} = this.props;
	//
	// 	return Promise.all(this.getPrimitiveKeysByPath(path)
	// 		.filter(key => store.getValue(path + '/' + key) === undefined)
	// 		.map(key => store.load(path + '/' + key)));
	//
	// }

	// getSchemaByPath(path){
	// 	const schema = this.getSchema();
	// 	return schemaGet(schema, path);
	// }
	//
	// isSchemaPathPrimitive(path){
	// 	const pathSchema = this.getSchemaByPath(path);
	// 	return !isObject(pathSchema);
	//
	// }
	//
	// getPrimitiveKeysByPath(path){
	// 	const schema = this.getSchema();
	//
	// 	return getSchemaPrimitiveKeysByPath(schema, path);
	// }
	//
	// geNonPrimitiveKeysByPath(path){
	// 	const {store} = this.props;
	// 	const pathSchema = this.getSchemaByPath(path);
	//
	// 	if(pathSchema._){
	// 		return Object.keys(store.getValue(path) || {})
	// 	}else{
	// 		return Object.keys(pathSchema)
	// 			.filter(key => isObject(pathSchema[key]))
	// 	}
	// }

	// @autobind
	// clearActivePath(){
	// 	this.obState.activePath = null;
	// 	this.formStore.reset();
	// 	this.clearSettingsPath();
	// 	// todo: removed from store, ned to find alternative
	// 	document.body.style.paddingLeft = '';
	// }
	//
	// @autobind
	// getSettingsByPath(path){
	// 	const {settingsPath} = this.obState;
	//
	// 	const schema = this.getSchema();
	// 	const schemaSettings = this.getSchemaSettings();
	//
	// 	const schemaPath = toSchemaPath(schema, path);
	//
	// 	if(schemaPath === settingsPath){
	// 		return this.settingsFormStore.toJS();
	// 	}else if(schemaSettings){
	// 		return schemaGet(schemaSettings, schemaPath);
	// 	}
	// }
	//
	// @autobind
	// async handleSettingsSubmit(){
	// 	const {store} = this.props;
	// 	const {settingsPath} = this.obState;
	// 	const newValue = this.settingsFormStore.toJS();
	//
	// 	await store.setValue(SCHEMA_SETTINGS_KEY_NAME + '/' + settingsPath, newValue);
	//
	// 	this.clearSettingsPath();
	// }
	//
	// clearSettingsPath(){
	// 	this.settingsFormStore.reset();
	// 	this.obState.settingsPath = null;
	// }

	// @autobind
	// setSettingsPath(path){
	// 	const schema = this.getSchema();
	// 	const schemaSettings = this.getSchemaSettings();
	//
	// 	const schemaPath = toSchemaPath(schema, path);
	// 	this.obState.settingsPath = schemaPath;
	//
	// 	const defaultSettings = {
	// 		uiType: 'text'
	// 	};
	//
	// 	this.settingsFormStore.reset(schemaGet(schemaSettings, schemaPath) || defaultSettings);
	// }
	//
	// @autobind
	// async handleCreate(key){
	// 	const {store} = this.props;
	// 	const {activePath} = this.obState;
	// 	if(key){
	// 		store.setValue(activePath + '/' + key, {});
	// 		this.setActivePath(activePath + '/' + key);
	// 	}else{
	// 		const newKey = store.push(activePath).key;
	// 		this.setActivePath(activePath + '/' + newKey);
	// 	}
	// }
	//
	//
	// @autobind
	// async handleRemove(key){
	// 	const {store} = this.props;
	// 	const {activePath} = this.obState;
	// 	// todo: removed this part from store
	// 	if(!confirm('are you sure?')){
	// 		return;
	// 	}
	// 	store.remove(activePath + '/' + key);
	// }
	//
	// getSchema(){
	// 	return {
	// 		...this.props.store.getValue(SCHEMA_KEY_NAME),
	// 		...orkanSchema
	// 	};
	// }
	//
	// getSchemaSettings(){
	// 	return {
	// 		...this.props.store.getValue(SCHEMA_SETTINGS_KEY_NAME),
	// 		...orkanSchemaSettings
	// 	};
	// }

	// @autobind
	// async handleApproveUserRequest(uid){
	// 	const {store} = this.props;
	// 	await store.remove(USER_REQUESTS_KEY_NAME + '/'	+ uid);
	// 	await store.setValue(USERS_KEY_NAME + '/'	+ uid, {editData: true});
	// }
	//
	//
	// @autobind
	// async handleDeclineUserRequest(uid){
	// 	const {store} = this.props;
	// 	// todo: removed this from store
	// 	if(!confirm('are you sure?')){
	// 		return;
	// 	}
	// 	await store.remove(USER_REQUESTS_KEY_NAME + '/'	+ uid);
	// }

	render() {
		const {className, store} = this.props;
		const {isLoading, isResizing} = this.obState;


		const schema = store.getSchema();

		if(!schema){
			return null;
		}

		let headerParts;
		let headerTitle;

		if(store.activePath){
			headerParts = store.activePath.split('/');

			if(store.isSchemaPathPrimitive(store.activePath)){
				headerParts = headerParts.slice(0, -1);
			}

			headerTitle = headerParts.map((part, i) => [
				<span key={i} onClick={() => store.setActivePath(headerParts.slice(0, i+1).join('/'))}>{i === 0 && headerParts.length === 1?'Root':part}</span>,
				i < headerParts.length - 1 && '/'
			]);
		}

		const newClassName = classNames('Orkan', className, {
			'Orkan-disabled': isResizing
		});

		const isActivePathCollection = store.activePath && !!store.getSchemaByPath(store.activePath)._;

		return (
			<div className={newClassName}>
				{!store.isAdmin() && <OrkanAuth auth={store.authStore}/>}
				{store.isAdmin() && store.activePath &&
				<Sidebar
					side='left'
					initialSize={300}
					className='Orkan-ui'
					onResizeStart={() => this.obState.isResizing = true}
					onResizeEnd={() => this.obState.isResizing = false}
					onResize={size => document.body.style.paddingLeft = size + 'px'}>

					<OrkanUsersRequests onApprove={uid => store.approveUserRequest(uid)} onDecline={uid => store.declineUserRequest(uid)}/>

					<OrkanHeader primary title={headerTitle} onClose={this.clearActivePath}/>

					{isLoading && <OrkanSpinner/>}

					{store.settingsPath &&
						<OrkanSettingsPanel
							getCollectionPaths={() => getSchemaCollectionPaths(schema)}
							getPrimitives={path => store.getPrimitiveKeysByPath(path + '/_')}
							onClose={() => this.obState.settingsPath = null}
							onSubmit={() => store.submitSettings()}
							editPath={store.settingsPath}
							formStore={store.settingsFormStore}
							schema={store.getSchemaByPath(store.settingsPath)} />
					}
					<div className='Orkan-ui-scroll'>
						{!isLoading &&
						<OrkanDataForm
							getData={path => store.getValue(path)}
							getFieldSettings={store.getSettingsByPath}
							onSubmit={() => store.submitData()}
							onCancel={() => store.clearActivePath()}
							editPath={store.activePath}
							schema={store.getSchemaByPath(store.activePath)}
							onSettings={path => store.setSettingsPath(path)}
							formStore={store.dataFormStore} />
						}

						{!isLoading &&
							<OrkanPaths
								isCollection={isActivePathCollection}
								path={isActivePathCollection && store.activePath}
								keys={store.geNonPrimitiveKeysByPath(store.activePath)}
								onCreate={isActivePathCollection && (key => store.createCollectionItem(key))}
								onRemove={isActivePathCollection && (key => store.removeCollectionItem(key))}
								onSelect={key => store.setActivePath(store.activePath + '/' + key)}
								showHeader={!isActivePathCollection && store.getPrimitiveKeysByPath(store.activePath).length > 0} />
						}
					</div>
					<div className="Orkan-ui-footer">
						<div className="Orkan-ui-footer-auth">
							<Img src={store.user.photoURL}/>
							<span onClick={() => store.authStore.signOut()}>Logout</span>
						</div>
						<span/>
					</div>

				</Sidebar>
				}
			</div>
		);
	}
}

//
// const orkanSchema = {
// 	usersPermissions: {
// 		_: {
// 			editData: 'string',
// 			editPermissions: 'string',
// 			editSchema: 'string',
// 		}
// 	}
// };
//
//
// const orkanSchemaSettings = {
// 	usersPermissions: {
// 		_: {
// 			editData: {
// 				uiType: 'checkbox'
// 			},
// 			editPermissions: {
// 				uiType: 'checkbox'
// 			},
// 			editSchema: {
// 				uiType: 'checkbox'
// 			}
// 		}
// 	}
// };