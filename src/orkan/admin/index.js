import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable, reaction} from 'mobx';
import autobind from 'autobind-decorator';

import Sidebar from '../sidebar';
import DataForm from '../data-form';
import SettingsPanel from '../settings-panel';
import Header from '../header';
import {keyboard, onDoublePress} from '../utils/keyboard-utils';
import Auth from '../auth';
import Spinner from '../spinner';
import Paths from '../paths';
import Img from '../img';
import UsersRequests from '../users-requests';
import OrkanStore from '../orkan-store';
import { SCHEMA_KEY_NAME} from '../constants';
import SchemaEditor from '../schema-editor';
import {getParentPath} from '../utils/path-utils';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';


@observer
export default class Admin extends Component{

	static propTypes = {
		store: PropTypes.instanceOf(OrkanStore).isRequired
	};


	@observable obState = {
		isResizing: false
	};

	componentWillMount(){
		const {store} = this.props;

		store.init();

		this.killAuthReaction = reaction(() => !store.isAdmin() && !store.isInitializing, isAuthRequired => {
			isAuthRequired?store.openModal(Auth):store.clearModal();
		}, {fireImmediately: true});


		keyboard.bind('escape', this.handleClose);

		onDoublePress('shift', () => {
			!store.activePath && store.setActivePath('.');
		});
	}

	componentWillUnmount(){
		this.killAuthReaction();
	}


	@autobind
	handleClose(){
		const {store} = this.props;
		store.activePath && store.clearActivePath();
		document.body.style.paddingLeft = '';
	}

	@autobind
	handleLogout(){
		const {store} = this.props;
		this.handleClose();
		store.logout();
	}

	@autobind
	handleDeclineUserRequest(uid){
		const {store} = this.props;

		if(!confirm('are you sure?')){
			return;
		}

		store.declineUserRequest(uid);
	}

	render() {
		const {className, store} = this.props;
		const {isResizing} = this.obState;


		if(store.isInitializing){
			return null;
		}

		const s = createStyle(style, className, {
			root: {
				disabled: isResizing
			}
		});

		let headerParts;
		let headerTitle;

		if(store.activePath){
			headerParts = store.activePath.split('/');

			if(store.isPathPrimitive(store.activePath, true)){
				headerParts = headerParts.slice(0, -1);
			}

			headerTitle = headerParts.map((part, i) => [
				<span className={s.titlePart} key={i} onClick={() => store.setActivePath(headerParts.slice(0, i+1).join('/'))}>{i === 0 && headerParts.length === 1?'Root':part}</span>,
				i < headerParts.length - 1 && '/'
			]);
		}



		return (
			<div className={s.root}>
				{store.isAdmin() && store.activePath &&
					<Sidebar
						side='left'
						initialSize={300}
						classes={{root: s.sidebar, content: s.sidebarContent}}
						onResizeStart={() => this.obState.isResizing = true}
						onResizeEnd={() => this.obState.isResizing = false}
						onResize={size => document.body.style.paddingLeft = size + 'px'}>

						<UsersRequests onApprove={uid => store.approveUserRequest(uid)} onDecline={this.handleDeclineUserRequest}/>

						<Header primary title={headerTitle} onClose={this.handleClose}/>

						{store.isLoadingActivePath && <Spinner className={s.spinner}/>}


						<div className={s.scrollContainer}>
							{/*{store.isPathCollection(getParentPath(store.activePath)) &&*/}
								{/*<div className={s.collectionItemHeader}>*/}
									{/*hello*/}
								{/*</div>*/}
							{/*}*/}
							{!store.isLoadingActivePath &&
								<DataForm
									className={s.dataForm}
									path={store.activePath}
									store={store}/>
							}

							{!store.isLoadingActivePath &&
								<Paths
									path={store.activePath}
									store={store} />
							}

							{store.activePath === './' + SCHEMA_KEY_NAME &&
								<SchemaEditor
									value={store.getSchema()}
									onChange={value => store.dataStore.setValue(SCHEMA_KEY_NAME, value)}/>
							}
						</div>
						<div className={s.footer}>
							<div className={s.footerAuth}>
								<Img className={s.footerAuthImg} src={store.user.photoURL}/>
								<span onClick={this.handleLogout}>Logout</span>
							</div>
							<span/>
						</div>

					</Sidebar>
				}

				{store.settingsPath &&
					<SettingsPanel
						className={s.settingsPanel}
						store={store}/>
				}

				{store.modal && <store.modal.Component {...store.modal.props} className={s.modal}/>}
			</div>
		);
	}
}