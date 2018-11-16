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
import {SCHEMA_PATH} from '../constants';
import SchemaEditor from '../schema-editor';
import {toAbsolutePath} from '../utils/path-utils';
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
		const {store, store2} = this.props;

		store2.init();

		this.killAuthReaction = reaction(() => !store2.isAdmin() && !store2.isInitializing, isAuthRequired => {
			isAuthRequired?store2.openModal(Auth):store2.clearModal();
		}, {fireImmediately: true});


		keyboard.bind('escape', this.handleClose);

		onDoublePress('shift', () => {
			!store2.activePath && store2.setActivePath('.');
		});
	}

	componentWillUnmount(){
		this.killAuthReaction();
	}


	@autobind
	handleClose(){
		const {store2} = this.props;
		store2.activePath && store2.clearActivePath();
		document.body.style.paddingLeft = '';
	}

	@autobind
	handleLogout(){
		const {store2} = this.props;
		this.handleClose();
		store2.logout();
	}

	@autobind
	handleDeclineUserRequest(uid){
		const {store2} = this.props;

		if(!confirm('are you sure?')){
			return;
		}

		store2.declineUserRequest(uid);
	}

	render() {
		const {className, store2} = this.props;
		const {isResizing} = this.obState;


		if(store2.isInitializing){
			return null;
		}

		const s = createStyle(style, className, {
			root: {
				disabled: isResizing
			}
		});

		let headerParts;
		let headerTitle;

		if(store2.activePath){
			headerParts = store2.activePath.split('/');

			if(store2.isPathPrimitive(store2.activePath, true)){
				headerParts = headerParts.slice(0, -1);
			}

			headerTitle = headerParts.map((part, i) => [
				<span className={s.titlePart} key={i} onClick={() => store2.setActivePath(headerParts.slice(0, i+1).join('/'))}>{i === 0 && headerParts.length === 1?'Root':part}</span>,
				i < headerParts.length - 1 && '/'
			]);
		}



		return (
			<div className={s.root}>
				{store2.isAdmin() && store2.activePath &&
					<Sidebar
						side='left'
						initialSize={300}
						classes={{root: s.sidebar, content: s.sidebarContent}}
						onResizeStart={() => this.obState.isResizing = true}
						onResizeEnd={() => this.obState.isResizing = false}
						onResize={size => document.body.style.paddingLeft = size + 'px'}>

						<UsersRequests onApprove={uid => store.approveUserRequest(uid)} onDecline={this.handleDeclineUserRequest}/>

						<Header primary title={headerTitle} onActionClick={this.handleClose}/>

						{store2.isLoadingActivePath && <Spinner className={s.spinner}/>}


						<div className={s.scrollContainer}>
							{!store2.isLoadingActivePath &&
								<DataForm
									className={s.dataForm}
									path={store2.activePath}
									store={store2}/>
							}

							{!store2.isLoadingActivePath &&
								<Paths
									path={store2.activePath}
									store={store2} />
							}

							{store2.activePath === toAbsolutePath(SCHEMA_PATH) &&
								<SchemaEditor
									value={store2.getSchema()}
									onChange={value => store2.dataStore.setValue(SCHEMA_PATH, value)}/>
							}
						</div>
						<div className={s.footer}>
							<div className={s.footerAuth}>
								<Img className={s.footerAuthImg} src={store2.user.photoURL}/>
								<span onClick={this.handleLogout}>Logout</span>
							</div>
							<span/>
						</div>

					</Sidebar>
				}

				{store2.settingsPath &&
					<SettingsPanel
						className={s.settingsPanel}
						store={store2}/>
				}

				{store2.modal && <store2.modal.Component {...store2.modal.props} className={s.modal}/>}
			</div>
		);
	}
}