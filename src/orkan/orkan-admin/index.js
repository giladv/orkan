import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import Sidebar from '../sidebar';
import OrkanDataForm from '../orkan-data-form';
import OrkanSettingsPanel from '../orkan-settings-panel';
import Header from '../header';
import {keyboard, onDoublePress} from '../utils/keyboard-utils';
import OrkanAuth from '../orkan-auth';
import OrkanSpinner from '../orkan-spinner';
import OrkanPaths from '../orkan-paths';
import Img from '../img';
import OrkanUsersRequests from '../orkan-users-requests';
import OrkanStore from '../orkan-store';
import { SCHEMA_KEY_NAME} from '../constants';
import OrkanSchemaEditor from '../orkan-schema-editor';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';


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

			if(store.isPathPrimitive(store.activePath, true)){
				headerParts = headerParts.slice(0, -1);
			}

			headerTitle = headerParts.map((part, i) => [
				<span key={i} onClick={() => store.setActivePath(headerParts.slice(0, i+1).join('/'))}>{i === 0 && headerParts.length === 1?'Root':part}</span>,
				i < headerParts.length - 1 && '/'
			]);
		}

		const s = createStyle(style, className, {
			root: {
				disabled: isResizing
			}
		});

		// const newClassName = classNames('Orkan', className, {
		// 	'Orkan-disabled': isResizing
		// });

		return (
			<div className={s.root}>
				{store.isAdmin() && store.activePath &&
					<Sidebar
						side='left'
						initialSize={300}
						className='Orkan-ui'
						onResizeStart={() => this.obState.isResizing = true}
						onResizeEnd={() => this.obState.isResizing = false}
						onResize={size => document.body.style.paddingLeft = size + 'px'}>

						<OrkanUsersRequests onApprove={uid => store.approveUserRequest(uid)} onDecline={this.handleDeclineUserRequest}/>

						<Header primary title={headerTitle} onClose={this.handleClose}/>

						{store.isLoadingActivePath && <OrkanSpinner/>}


						<div className='Orkan-ui-scroll'>

							{!store.isLoadingActivePath &&
								<OrkanDataForm
									path={store.activePath}
									store={store}/>
							}

							{!store.isLoadingActivePath &&
								<OrkanPaths
									path={store.activePath}
									store={store} />
							}

							{store.activePath === './' + SCHEMA_KEY_NAME &&
								<OrkanSchemaEditor
									value={store.getSchema()}
									onChange={value => store.dataStore.setValue(SCHEMA_KEY_NAME, value)}/>
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
						className={s.settingsPanel}
						store={store}/>
				}
				{!store.isInitiating && !store.isAdmin() && <OrkanAuth auth={store.authStore}/>}
				{store.modal && <store.modal.Component {...store.modal.props}/>}
			</div>
		);
	}
}