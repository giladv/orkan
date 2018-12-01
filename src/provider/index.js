import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import * as mobx from 'mobx';

import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/auth'
import 'firebase/storage'

import {
	ACTIVATION_EVENT_KEY, DEFAULT_BASE_PATH, FIREBASE_APP_NAME, ORKAN_ADMIN_GLOBAL, REACT_CONTEXT_NAME,
	SUPPORTED_AUTH_PROVIDERS,
} from '../constants';
import Firestore from '../firestore';
import inject from '../inject';
import {keyboard} from '../utils/keyboard-utils';
import Indicator from '../indicator/index';

import './style';

let OrkanAdmin;

@observer
export default class Provider extends Component{

	static propTypes = {
		allowGuests: PropTypes.bool,
		firebaseConfig: PropTypes.shape({
			apiKey: PropTypes.string,
			authDomain: PropTypes.string,
			databaseURL: PropTypes.string,
			projectId: PropTypes.string,
			storageBucket: PropTypes.string,
			messagingSenderId: PropTypes.string
		}).isRequired,
		authProviders: PropTypes.arrayOf(PropTypes.oneOf(SUPPORTED_AUTH_PROVIDERS))
	};

	static defaultProps = {
		authProviders: SUPPORTED_AUTH_PROVIDERS
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
			store: this.fireStore,
			getLiveValue: (...args) => !!this.adminStore && !!this.adminStore.isAdmin && this.adminStore.getLiveValue(...args),
			setActivePath: (...args) => !!this.adminStore && this.adminStore.setActivePathWhenPossible(...args),
			isEditMode: () => {
				const {isActive, isModifierKeyDown} = this.obState;
				return isActive && !!this.adminStore && !!this.adminStore.isAdmin && !!isModifierKeyDown
			},
			isAdminOpen: () => this.adminStore && this.adminStore.activePath,

			// is this making any sense??
			openModal: (...props) => this.adminStore && this.adminStore.openModal(...props)
		}};
	}

	componentWillMount(){
		const {firebaseConfig, allowGuests} = this.props;
		this.firebaseApp = firebase.initializeApp(firebaseConfig, FIREBASE_APP_NAME);
		const nativeFirestore = firebase.firestore(this.firebaseApp);
		nativeFirestore.settings({timestampsInSnapshots: true});
		this.fireStore = new Firestore(nativeFirestore);

		allowGuests && this.firebaseApp.auth().signInAnonymously();

		keyboard.bind('hold:1000:' + ACTIVATION_EVENT_KEY, this.activateAdmin);

		document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);

		// does not fire with normal api
		document.body.onblur = this.handleBlur;
	}

	@autobind
	async activateAdmin(){
		if(this.obState.isActive){
			return;
		}

		this.obState.isBusy = true;
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
		const {children} = this.props;
		const {isActive, isBusy} = this.obState;

		return [
			children,
			(isActive || isBusy) && ReactDOM.createPortal(<Indicator isBusy={isBusy || (this.adminStore && this.adminStore.isInitializing)} />, document.body),
			isActive && ReactDOM.createPortal(<OrkanAdmin dataStore={this.fireStore} onStoreReady={this.handleStoreReady} />, document.body)
		];
	}
}