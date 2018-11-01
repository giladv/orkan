import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';

import Sidebar from '../sidebar';
import DataForm from '../data-form';
import OrkanSettingsPanel from '../orkan-settings-panel';
import Header from '../header';
import {keyboard, onDoublePress} from '../utils/keyboard-utils';
import Auth from '../auth';
import Spinner from '../spinner';
import Paths from '../paths';
import Img from '../img';
import OrkanUsersRequests from '../orkan-users-requests';
import OrkanStore from '../orkan-store';
import { SCHEMA_KEY_NAME} from '../constants';
import SchemaEditor from '../schema-editor';
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
		window.b = store;


		keyboard.bind('escape', this.handleClose);

		onDoublePress('shift', () => {
			!store.activePath && store.setActivePath('.');
		});

		window.lo = () => auth.signOut();
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

	render() {
		const {className, store} = this.props;
		const {isResizing} = this.obState;


		const schema = store.getSchema();

		if(!schema){
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

						<OrkanUsersRequests onApprove={uid => store.approveUserRequest(uid)} onDecline={this.handleDeclineUserRequest}/>

						<Header primary title={headerTitle} onClose={this.handleClose}/>

						{store.isLoadingActivePath && <Spinner className={s.spinner}/>}


						<div className={s.scrollContainer}>

							{!store.isLoadingActivePath &&
								<DataForm
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

				{!store.isInitiating && !store.isAdmin() && <Auth className={s.auth} auth={store.authStore}/>}
				{store.modal && <store.modal.Component {...store.modal.props}/>}
			</div>
		);
	}
}