import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import isObject from 'lodash/isObject';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import ReactDOM from 'react-dom';

import FormStore from '../form/form-store';
import Sidebar from '../sidebar';
import OrkanDataForm from '../orkan-data-form';
import OrkanSettingsPanel from '../orkan-settings-panel';
import OrkanHeader from '../orkan-header';
import {
	REACT_CONTEXT_NAME, SCHEMA_KEY_NAME, SCHEMA_SETTINGS_KEY_NAME, USER_REQUESTS_KEY_NAME,
	USERS_KEY_NAME
} from '../constants';
import {getSchemaCollectionPaths, getSchemaPrimitiveKeysByPath, schemaGet, toSchemaPath} from '../utils/schema-utils';
import {keyboard, onDoublePress} from '../utils/keyboard-utils';
import FirebaseStore from '../firebase-store';
import OrkanAuth from '../orkan-auth';
import OrkanSpinner from '../orkan-spinner';
import OrkanPaths from '../orkan-paths';
import Img from '../img';
import OrkanUsersRequests from '../orkan-users-requests';

import './style.scss';

const toAbsolutePath = path => {
	let pathParts = path.split('/');
	if(pathParts[0] !== '.'){
		pathParts.unshift('.');
	}

	return pathParts.join('/');
};




@observer
export default class OrkanProvider extends Component{

	static propTypes = {
		store: PropTypes.instanceOf(FirebaseStore).isRequired,
		auth: PropTypes.object.isRequired
	};

	static childContextTypes = {
		[REACT_CONTEXT_NAME]: PropTypes.object
	};

	static contextTypes = {
		[REACT_CONTEXT_NAME]: PropTypes.object
	};

	@observable obState = {
		activePath: null,
		settingsPath: null,
		isActive: true,
		isEditMode: false,
		isAuthOpen: true,
		isLoading: false,
		isResizing: false
	};

	@observable.ref user = null;

	getChildContext() {
		const {store} = this.props;
		return {[REACT_CONTEXT_NAME]: {
			store,
			getValue: this.getValue,
			isEditMode: this.isEditMode,
			isActive: this.isActive,
			setActivePath: this.setActivePath,
			isAdmin: this.isAdmin
		}};
	}

	componentWillMount(){
		const {store, auth} = this.props;
		window.b = store
		this.formStore = new FormStore({}, {});

		this.settingsFormStore = new FormStore({}, {});

		store.listen(SCHEMA_KEY_NAME);
		store.listen(SCHEMA_SETTINGS_KEY_NAME);

		document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);

		// does not fire with normal api
		document.body.onblur = this.handleBlur;



		keyboard.bind('hold:1000:o', (e, elapsed) => {
			this.obState.isActive = true;
		});

		keyboard.bind('escape', (e, elapsed) => {
			const {activePath} = this.obState;
			activePath && this.clearActivePath();
		});

		onDoublePress('shift', () => {
			const {isActive, activePath} = this.obState;
			isActive && !activePath && this.setActivePath('.');
		});



		auth.onAuthStateChanged(async user => {
			if(user){
				let userPermissions;
				try{
					userPermissions = await store.load(USERS_KEY_NAME + '/' + user.uid);
				}catch(err){

				}

				if(userPermissions){
					this.user = user;
				}else{
					await store.setValue(USER_REQUESTS_KEY_NAME + '/' + user.uid, {email: user.email, avatarUrl: user.photoURL});
					auth.signOut();
				}
			}else{
				this.user = null;
			}
		});


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

	@autobind
	getValue(path){
		const {store} = this.props;
		const {activePath, isLoading} = this.obState;

		// to enable components use relative paths (e.g something vs ./something)
		path = toAbsolutePath(path);

		if(isLoading){
			return store.getValue(path);
		}

		if(activePath === path){
			return this.formStore.get(activePath) || store.getValue(path);
		}else if(activePath && activePath.indexOf(path) === 0){
			return {
				...store.getValue(path),
				[activePath.replace(path + '/', '')]: this.formStore.get(activePath) || store.getValue(activePath)
			};
		}else if(!this.isSchemaPathPrimitive(path)){
			return store.getValue(path);
		}else if(activePath && path.indexOf(activePath) === 0){

			const relativePath = path.replace(activePath, '');
			let relativePathParts = relativePath.split('/');
			relativePathParts.shift(); // removing the first item because its empty

			if(relativePathParts.length === 1){
				const formValue = this.formStore.get(activePath);
				return formValue && formValue[relativePathParts[0]];
			}else{
				return store.getValue(path);
			}

		}else{
			return store.getValue(path);
		}

	}

	@autobind
	async setActivePath(path){
		const {store} = this.props;

		// to enable components use relative paths (e.g something vs ./something)
		path = toAbsolutePath(path);

		this.obState.activePath = path;
		this.formStore.reset();

		this.obState.isLoading = true;
		await this.loadRequiredFieldsByPath(path);
		this.obState.isLoading = false;
		const storeValue = store.getValue(path) || {};

		if(!this.isSchemaPathPrimitive(path)){
			this.getPrimitiveKeysByPath(path).forEach(key => {
				this.formStore.set(`${path}.${key}`, storeValue[key]);
			});
		}else{
			this.formStore.set(path, store.getValue(path));
		}

		setTimeout(() => this.formStore.setClean(), 2);


	}

	@autobind
	async handleSubmit(){
		const {store} = this.props;
		const {activePath} = this.obState;
		const newValue = this.formStore.get(activePath);
		const currentValue = store.getValue(activePath);


		if(isObject(newValue) && isObject(currentValue)){
			await store.setValue(activePath, {...currentValue, ...newValue});
		}else{
			await store.setValue(activePath, newValue);
		}

		setTimeout(() => this.formStore.setClean(), 2);
	}

	loadRequiredFieldsByPath(path){
		const {store} = this.props;

		return Promise.all(this.getPrimitiveKeysByPath(path)
			.filter(key => store.getValue(path + '/' + key) === undefined)
			.map(key => store.load(path + '/' + key)));

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
		const {store} = this.props;
		const pathSchema = this.getSchemaByPath(path);

		if(pathSchema._){
			return Object.keys(store.getValue(path) || {})
		}else{
			return Object.keys(pathSchema)
				.filter(key => isObject(pathSchema[key]))
		}
	}

	@autobind
	clearActivePath(){
		this.obState.activePath = null;
		this.formStore.reset();
		this.clearSettingsPath();
		document.body.style.paddingLeft = '';
	}

	@autobind
	getSettingsByPath(path){
		const {settingsPath} = this.obState;

		const schema = this.getSchema();
		const schemaSettings = this.getSchemaSettings();

		const schemaPath = toSchemaPath(schema, path);

		if(schemaPath === settingsPath){
			return this.settingsFormStore.toJS();
		}else if(schemaSettings){
			return schemaGet(schemaSettings, schemaPath);
		}
	}

	@autobind
	async handleSettingsSubmit(){
		const {store} = this.props;
		const {settingsPath} = this.obState;
		const newValue = this.settingsFormStore.toJS();

		await store.setValue(SCHEMA_SETTINGS_KEY_NAME + '/' + settingsPath, newValue);

		this.clearSettingsPath();
	}

	clearSettingsPath(){
		this.settingsFormStore.reset();
		this.obState.settingsPath = null;
	}

	@autobind
	setSettingsPath(path){
		const schema = this.getSchema();
		const schemaSettings = this.getSchemaSettings();

		const schemaPath = toSchemaPath(schema, path);
		this.obState.settingsPath = schemaPath;

		const defaultSettings = {
			uiType: 'text'
		};

		this.settingsFormStore.reset(schemaGet(schemaSettings, schemaPath) || defaultSettings);
	}

	@autobind
	async handleCreate(key){
		const {store} = this.props;
		const {activePath} = this.obState;
		if(key){
			store.setValue(activePath + '/' + key, {});
			this.setActivePath(activePath + '/' + key);
		}else{
			const newKey = store.push(activePath).key;
			this.setActivePath(activePath + '/' + newKey);
		}
	}


	@autobind
	async handleRemove(key){
		const {store} = this.props;
		const {activePath} = this.obState;
		if(!confirm('are you sure?')){
			return;
		}
		store.remove(activePath + '/' + key);
	}

	getSchema(){
		return {
			...this.props.store.getValue(SCHEMA_KEY_NAME),
			...orkanSchema
		};
	}

	getSchemaSettings(){
		return {
			...this.props.store.getValue(SCHEMA_SETTINGS_KEY_NAME),
			...orkanSchemaSettings
		};
	}

	@autobind
	async handleApproveUserRequest(uid){
		const {store} = this.props;
		await store.remove(USER_REQUESTS_KEY_NAME + '/'	+ uid);
		await store.setValue(USERS_KEY_NAME + '/'	+ uid, {editData: true});
	}


	@autobind
	async handleDeclineUserRequest(uid){
		const {store} = this.props;
		if(!confirm('are you sure?')){
			return;
		}
		await store.remove(USER_REQUESTS_KEY_NAME + '/'	+ uid);
	}

	render() {
		const {className, children, store, auth} = this.props;
		const {activePath, isActive, settingsPath, isLoading, isResizing} = this.obState;

		const schema = this.getSchema();

		if(!isActive || !schema){
			return children;
		}

		let headerParts;
		let headerTitle;

		if(activePath){
			headerParts = activePath.split('/');

			if(this.isSchemaPathPrimitive(activePath)){
				headerParts = headerParts.slice(0, -1);
			}

			headerTitle = headerParts.map((part, i) => [
				<span key={i} onClick={() => this.setActivePath(headerParts.slice(0, i+1).join('/'))}>{i === 0 && headerParts.length === 1?'Root':part}</span>,
				i < headerParts.length - 1 && '/'
			]);
		}

		const newClassName = classNames('Orkan', className, {
			'Orkan-disabled': isResizing
		});

		const isActivePathCollection = activePath && !!this.getSchemaByPath(activePath)._;

		return [
			children,
			ReactDOM.createPortal(
				<div className={newClassName}>
					<div className="Orkan-indicator"/>
					{!this.isAdmin() &&
						<OrkanAuth auth={auth}/>
					}
					{this.isAdmin() && activePath &&
						<Sidebar
							side='left'
							initialSize={300}
							className='Orkan-ui'
							onResizeStart={() => this.obState.isResizing = true}
							onResizeEnd={() => this.obState.isResizing = false}
							onResize={size => document.body.style.paddingLeft = size + 'px'}>

							<OrkanUsersRequests onApprove={this.handleApproveUserRequest} onDecline={this.handleDeclineUserRequest}/>

							<OrkanHeader primary title={headerTitle} onClose={this.clearActivePath}/>

							{isLoading && <OrkanSpinner/>}

							{settingsPath &&
								<OrkanSettingsPanel
									getCollectionPaths={() => getSchemaCollectionPaths(schema)}
									getPrimitives={path => this.getPrimitiveKeysByPath(path + '/_')}
									onClose={() => this.obState.settingsPath = null}
									onSubmit={this.handleSettingsSubmit}
									editPath={settingsPath}
									formStore={this.settingsFormStore}
									schema={this.getSchemaByPath(settingsPath)} />
							}
							<div className='Orkan-ui-scroll'>
								{!isLoading &&
									<OrkanDataForm
										getData={path => this.getValue(path)}
										getFieldSettings={this.getSettingsByPath}
										onSubmit={this.handleSubmit}
										onCancel={() => this.clearActivePath()}
										editPath={activePath}
										schema={this.getSchemaByPath(activePath)}
										onSettings={this.setSettingsPath}
										formStore={this.formStore} />
									}

								{!isLoading &&
									<OrkanPaths
										isCollection={isActivePathCollection}
										path={isActivePathCollection && activePath}
										keys={this.geNonPrimitiveKeysByPath(activePath)}
										onCreate={isActivePathCollection && this.handleCreate}
										onRemove={isActivePathCollection && this.handleRemove}
										onSelect={key => this.setActivePath(activePath + '/' + key)}
										showHeader={!isActivePathCollection && this.getPrimitiveKeysByPath(activePath).length > 0} />
								}
							</div>
							<div className="Orkan-ui-footer">
								<div className="Orkan-ui-footer-auth">
									<Img src={this.user.photoURL}/>
									<span onClick={() => this.props.auth.signOut()}>Logout</span>
								</div>
								<span/>
							</div>

						</Sidebar>
					}
				</div>
				, document.body)
		];
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
