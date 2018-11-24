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
import {keyboard} from '../utils/keyboard-utils';
import Indicator from '../indicator';
import OrkanStore2 from '../orkan-store2';

import './style';

let OrkanAdmin;

window.mobx = mobx;
window.React = React;
window.ReactDOM = ReactDOM;
window.PropTypes = PropTypes;
window.classNames = classNames;
window.autobind = autobind;
window.firebase = firebase;




@observer
export default class Provider extends Component{

	static propTypes = {
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
		basePath: DEFAULT_BASE_PATH,
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

	@observable.ref orkanStore;

	getChildContext() {

		return {[REACT_CONTEXT_NAME]: {
			store: this.fireStore,
			getValue: (path, options) => this.orkanStore2?this.orkanStore2.getLiveValue(path, options):this.fireStore.getValue(path, options),
			setActivePath: path => this.orkanStore2.setActivePath(path),
			isEditMode: () => {
				const {isActive, isModifierKeyDown} = this.obState;
				return isActive && this.orkanStore2.isAdmin && isModifierKeyDown
			},
			// is this making any sense??
			openModal: (...props) => this.orkanStore2 && this.orkanStore2.openModal(...props)
		}};
	}

	componentWillMount(){
		const {firebaseConfig} = this.props;
		this.firebaseApp = firebase.initializeApp(firebaseConfig, FIREBASE_APP_NAME);
		this.fireStore = new Firestore(firebase.firestore(this.firebaseApp));

		// this.fireStore.load('objects/home/features/list').then(users => console.log('load', users));
		// this.fireStore.listen('orkanUsers', {where: {active: {'==': true}}});
		// this.fireStore.listen(path);
		// window.set = () => this.fireStore.setValue('orkanUsers/new', {blabla: 123, active: true});
		// window.remove = () => this.fireStore.remove('orkanUsers/new/active');
		// this.fireStore.listen('orkanUsers');
		// this.activate();

		keyboard.bind('hold:1000:' + ACTIVATION_EVENT_KEY, this.activate);

		document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);

		// does not fire with normal api
		document.body.onblur = this.handleBlur;
	}

	@autobind
	async activate(){
		if(this.obState.isActive){
			return;
		}

		this.obState.isBusy = true;
		try{
			const fetchUrl = process.env.NODE_ENV === 'development'
				?'http://localhost:8081/admin.js'
				:'https://my-proj-5cbb6.firebaseapp.com/admin.js';

			const response = await fetch(fetchUrl);
			eval(await response.text());
			OrkanAdmin = window[ORKAN_ADMIN_GLOBAL].default;
			delete window[ORKAN_ADMIN_GLOBAL];

			window.s2 = this.orkanStore2 = new OrkanStore2(this.fireStore, this.firebaseApp.auth());
			this.obState.isActive = true;
		}catch(err){
			console.error(err);
		}

		setTimeout(() => {
			this.obState.isBusy = false;
		}, 500)
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
			(isActive || isBusy) && ReactDOM.createPortal(<Indicator isBusy={isBusy || (this.orkanStore2 && this.orkanStore2.isInitializing)} />, document.body),
			isActive && ReactDOM.createPortal(<OrkanAdmin store2={this.orkanStore2} />, document.body)
		];
	}
}