import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {configure, observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import map from 'lodash/map';
import isObject from 'lodash/isObject';
import set from 'lodash/set';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';

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
import OrkanMediaGallery from '../orkan-media-gallery';
import OrkanActionButton from '../orkan-action-button';
import Input from '../controls/input';
import {SCHEMA_KEY_NAME} from '../constants';
import OrkanIcon from '../orkan-icon';


@observer
export default class OrkanProvider extends Component{

	static propTypes = {
		store: PropTypes.instanceOf(OrkanStore).isRequired
	};


	@observable obState = {
		isResizing: false
	};

	componentWillMount(){
		const {store} = this.props;

		store.init();
		window.b = store;


		keyboard.bind('escape', this.handleClose);

		onDoublePress('shift', () => {
			!store.activePath && store.setActivePath('.');
		});

		window.lo = () => auth.signOut();

		// store.openModal(OrkanMediaGallery);
	}

	@autobind
	handleClose(){
		const {store} = this.props;
		store.activePath && store.clearActivePath();
		document.body.style.paddingLeft = '';
	}

	@autobind
	handleDeclineUserRequest(uid){
		const {store} = this.props;

		if(!confirm('are you sure?')){
			return;
		}

		store.declineUserRequest(uid);
	}

	@autobind
	handleRemoveCollectionItem(key){
		const {store} = this.props;

		if(!confirm('are you sure?')){
			return;
		}

		store.removeCollectionItem(key);
	}

	render() {
		const {className, store} = this.props;
		const {isResizing} = this.obState;


		const schema = store.getSchema();

		if(!schema){
			return null;
		}

		let headerParts;
		let headerTitle;

		if(store.activePath){
			headerParts = store.activePath.split('/');

			if(store.isSchemaPathPrimitive(store.activePath, true)){
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

		return (
			<div className={newClassName}>
				{store.isAdmin() && store.activePath &&
					<Sidebar
						side='left'
						initialSize={300}
						className='Orkan-ui'
						onResizeStart={() => this.obState.isResizing = true}
						onResizeEnd={() => this.obState.isResizing = false}
						onResize={size => document.body.style.paddingLeft = size + 'px'}>

						<OrkanUsersRequests onApprove={uid => store.approveUserRequest(uid)} onDecline={this.handleDeclineUserRequest}/>

						<OrkanHeader primary title={headerTitle} onClose={this.handleClose}/>

						{store.isLoadingActivePath && <OrkanSpinner/>}


						<div className='Orkan-ui-scroll'>
							{!store.isLoadingActivePath &&
							<OrkanDataForm
								getData={path => store.getValue(path)}
								getFieldSettings={key => store.getSettingsByPath(key)}
								onSubmit={() => store.submitData()}
								onCancel={() => store.clearActivePath()}
								editPath={store.activePath}
								schema={store.getSchemaByPath(store.activePath, true)}
								onSettings={path => store.setSettingsPath(path)}
								formStore={store.dataFormStore} />
							}

							{!store.isLoadingActivePath &&
								<OrkanPaths
									path={store.activePath}
									store={store} />
							}
							{store.activePath === './' + SCHEMA_KEY_NAME &&
								<OrkanSchemaEditor value={store.getSchema()} onChange={value => store.dataStore.setValue(SCHEMA_KEY_NAME, value)}/>
							}
						</div>
						<div className="Orkan-ui-footer">
							<div className="Orkan-ui-footer-auth">
								<Img src={store.user.photoURL}/>
								<span onClick={() => store.logout()}>Logout</span>
							</div>
							<span/>
						</div>

					</Sidebar>
				}

				{store.settingsPath &&
					<OrkanSettingsPanel
						isCollectionPath={store.isPathCollection(store.settingsPath)}
						getCollectionPaths={() => getSchemaCollectionPaths(schema)}
						getPrimitives={path => store.getPrimitiveKeysByPath(path + '/_')}
						onClose={() => store.clearSettingsPath()}
						onSubmit={() => store.submitSettings()}
						editPath={store.settingsPath}
						formStore={store.settingsFormStore}
						schema={store.getSchemaByPath(store.settingsPath)} />
				}
				{!store.isInitiating && !store.isAdmin() && <OrkanAuth auth={store.authStore}/>}
				{store.modal && <store.modal.Component {...store.modal.props}/>}
			</div>
		);
	}
}









@observer
export class OrkanSchemaEditor extends Component{
	static propTypes = {
		value: PropTypes.object
	};

	@observable obState = {
		createPath: null,
		createValue: null,
		openPaths: ['']
	};

	@autobind
	handleKeyPress(e){
		const {onChange, value} = this.props;
		const {createPath, createValue} = this.obState;

		if(e.key === 'Enter'){
			const clone = cloneDeep(value);
			const fullPath = createPath + '.' + createValue;
			set(clone, fullPath, 'string');
			onChange(clone);
			// this.obState.createPath = null;
			this.obState.createValue = null;
		}else if(e.key === 'Esc'){
			this.obState.createPath = null;
			this.obState.createValue = null;
		}
	}

	@autobind
	handleBlur(){
		this.obState.createPath = null;
		this.obState.createValue = null;
	}



	@autobind
	handleRemoveField(path){
		const {onChange, value} = this.props;
		if(!confirm('are you sure?')){
			return;
		}
		const clone = cloneDeep(value);
		set(clone, path, null)
		onChange(clone);
		this.obState.createPath = null;
		this.obState.createValue = null;
	}

	togglePath(path){
		const {value} = this.props;
		const {openPaths} = this.obState;

		if(path && !isObject(get(value, path))){
			return;
		}
		if(this.isPathOpen(path)){
			openPaths.remove(path);
		}else{
			openPaths.push(path);
		}

	}

	isPathOpen(path){
		const {openPaths} = this.obState;
		return openPaths.includes(path);
	}

	renderField(key, field, parentPath){
		const {createPath, createValue, openPaths} = this.obState;

		const currentPath = [parentPath, key].filter(it => !!it).join('.');
		const isPathOpen = openPaths.includes(currentPath);

		const className = classNames('OrkanSchemaEditor-field', {
			'OrkanSchemaEditor-field-open': isPathOpen
		});

		const isFieldPrimitive = !isObject(field);

		return (
			<div key={key} className={className}>
				<div className='OrkanSchemaEditor-field-label'>

					{!isFieldPrimitive && <OrkanIcon type='arr' onClick={() => this.togglePath(currentPath)}/>}

					<div className="OrkanSchemaEditor-field-name" onClick={() => this.togglePath(currentPath)}>
						{key || 'Root'}
					</div>

					<div className="OrkanSchemaEditor-field-actions">
						{currentPath &&
							<OrkanActionButton icon='trash' onClick={() => this.handleRemoveField(currentPath)}/>
						}
						<OrkanActionButton icon='plus' onClick={() => {
								this.obState.createPath = currentPath;
								!this.isPathOpen(currentPath) && this.togglePath(currentPath);
						}}/>
					</div>
				</div>
				<div className='OrkanSchemaEditor-field-children' style={{height: isPathOpen?'auto':0}}>
					{createPath === currentPath &&
						<div><Input autoFocus value={createValue} onChange={value => this.obState.createValue = value} onKeyPress={this.handleKeyPress} onBlur={this.handleBlur}/></div>
					}
					{!isFieldPrimitive && map(field, (value, key) => this.renderField(key, value, currentPath))}
				</div>
			</div>
		);
	}
	render(){
		const {className, value} = this.props;

		const newClassName = classNames('OrkanSchemaEditor', className);
		return (
			<div className={newClassName}>
				{this.renderField(null, value, null)}
			</div>
		);
	}
}






window.or = OrkanProvider;