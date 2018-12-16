import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import * as mobx from 'mobx';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'
import 'firebase/storage'


console.log('?!?!?1', firebase, mobx);

import {
	ACTIVATION_EVENT_KEY, DEFAULT_BASE_PATH, FIREBASE_APP_NAME, ORKAN_ADMIN_GLOBAL, REACT_CONTEXT_NAME,
	SUPPORTED_AUTH_PROVIDERS,
} from '../constants';
import Firestore from '../firestore';
import inject from '../inject';
// import {keyboard} from '../utils/keyboard-utils';
import Indicator from '../indicator/index';

import './style';

let OrkanAdmin;
let firebaseApp;
let firestore;


@observer
export default class Provider extends Component{

	static propTypes = {
		onStoreReady: PropTypes.func,
		adminConfig: PropTypes.shape({
			color: PropTypes.oneOf(['default', 'dark']),
			authProviders: PropTypes.arrayOf(PropTypes.oneOf(SUPPORTED_AUTH_PROVIDERS)),
			allowGuests: PropTypes.bool
		}),
		firebaseConfig: PropTypes.shape({
			apiKey: PropTypes.string,
			authDomain: PropTypes.string,
			databaseURL: PropTypes.string,
			projectId: PropTypes.string,
			storageBucket: PropTypes.string,
			messagingSenderId: PropTypes.string
		}).isRequired,
	};

	static defaultProps = {
		onStoreReady: () => null
	};

	static childContextTypes = {
		[REACT_CONTEXT_NAME]: PropTypes.object
	};

	static contextTypes = {
		[REACT_CONTEXT_NAME]: PropTypes.object
	};

	@observable.shallow obState = {
		isModifierKeyDown: false,
		isActive: false,
		isBusy: false,
	};

	@observable.ref adminStore;

	getChildContext() {

		return {[REACT_CONTEXT_NAME]: {
			activateAdmin: () => this.activateAdmin(),
			store: firestore,
			getLiveValue: (...args) => !!this.adminStore && !!this.adminStore.isAdmin && this.adminStore.getLiveValue(...args),
			setActivePath: (...args) => !!this.adminStore && this.adminStore.setActivePathWhenPossible(...args),
			isEditMode: () => {
				const {isActive, isModifierKeyDown} = this.obState;
				return isActive && !!this.adminStore && !!this.adminStore.isAdmin && !!isModifierKeyDown
			},
			isAdminOpen: () => this.adminStore && this.adminStore.activePath
		}};
	}

	async componentWillMount(){
		const {firebaseConfig, onStoreReady, initialState} = this.props;
		if(!firebaseApp){
			firebaseApp = firebase.initializeApp(firebaseConfig, FIREBASE_APP_NAME);
			const nativeFirestore = firebase.firestore(firebaseApp);
			nativeFirestore.settings({timestampsInSnapshots: true});
			firestore = new Firestore(nativeFirestore, initialState,{
				DocumentSnapshot: firebase.firestore.DocumentSnapshot,
				QuerySnapshot: firebase.firestore.QuerySnapshot,
				QueryDocumentSnapshot: firebase.firestore.QueryDocumentSnapshot
			});

		}

		onStoreReady(firestore);
	}

	async componentDidMount(){
		const {firebaseConfig, adminConfig, onStoreReady, firebase} = this.props;

		// adminConfig && keyboard.bind('hold:1000:' + ACTIVATION_EVENT_KEY, this.activateAdmin);

		// document.addEventListener('keydown', this.handleKeyDown);
		// document.addEventListener('keyup', this.handleKeyUp);

		// does not fire with normal api
		// document.body.onblur = this.handleBlur;
	}

	guestLogin(){
		return new Promise((resolve) => {
			const {adminConfig} = this.props;

			// guest login
			if(adminConfig.allowGuests){
				const dispose = firebaseApp.auth().onIdTokenChanged(async firebaseUser => {
					dispose();
					!firebaseUser && await firebaseApp.auth().signInAnonymously();
					resolve();
				});
			}
		});
	}

	@autobind
	async activateAdmin(){
		if(this.obState.isActive){
			return;
		}


		this.obState.isBusy = true;

		await this.guestLogin();

		try{
			this.exposeDependencies();

			const fetchUrl = process.env.NODE_ENV === 'development'
				?'http://localhost:8081/admin.js'
				:'https://orkan-admin.firebaseapp.com/admin.js';

			const response = await fetch(fetchUrl);
			eval(await response.text());
			OrkanAdmin = window[ORKAN_ADMIN_GLOBAL].default;
			delete window[ORKAN_ADMIN_GLOBAL];
			this.obState.isActive = true;
		}catch(err){
			console.error(err);
		}

		setTimeout(() => {
			this.obState.isBusy = false;
		}, 500)
	}

	exposeDependencies(){
		window.mobx = mobx;
		window.React = React;
		window.ReactDOM = ReactDOM;
		window.PropTypes = PropTypes;
		window.classNames = classNames;
		window.autobind = autobind;
		window.firebase = firebase;
		window.orkan = {
			Provider,
			inject,
			Firestore
		};
	}

	@autobind
	handleStoreReady(store){
		this.adminStore = store;
	}

	@autobind
	handleBlur(e){
		this.obState.isModifierKeyDown = false;
	}


	@autobind
	handleKeyDown(e){
		if(e.key === 'Meta'){
			this.obState.isModifierKeyDown = true;
		}
	}

	@autobind
	handleKeyUp(e){
		if(e.key === 'Meta'){
			this.obState.isModifierKeyDown = false;
		}
	}

	render() {
		const {children, adminConfig} = this.props;
		const {isActive, isBusy} = this.obState;

		return [
			children,
			(isActive || isBusy) && ReactDOM.createPortal(<Indicator color={adminConfig.color} isBusy={isBusy || (this.adminStore && this.adminStore.isInitializing)} />, document.body),
			isActive && ReactDOM.createPortal(<OrkanAdmin config={adminConfig} dataStore={firestore} onStoreReady={this.handleStoreReady} />, document.body)
		];
	}
}