import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import {ACTIVATION_EVENT_KEY, ORKAN_ADMIN_GLOBAL, REACT_CONTEXT_NAME,} from '../constants';
import {keyboard} from '../utils/keyboard-utils';
import FirebaseStore from '../firebase-store';
import OrkanIndicator from '../orkan-indicator';
import OrkanStore from '../orkan-store';
import * as mobx from 'mobx';
import firebase from 'firebase/app';

import 'firebase/database';
import 'firebase/auth'

let OrkanAdmin;

window.mobx = mobx;
window.React = React;
window.ReactDOM = ReactDOM;
window.PropTypes = PropTypes;
window.classNames = classNames;
window.autobind = autobind;
window.firebase = firebase;


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

	@observable.shallow obState = {
		isModifierKeyDown: false,
		isActive: false,
		isBusy: false,
	};

	@observable.ref orkanStore;

	getChildContext() {
		const {store} = this.props;
		return {[REACT_CONTEXT_NAME]: {
			store: this.props.store,
			getValue: path => this.orkanStore?this.orkanStore.getValue(path):store.getValue(path),
			setActivePath: path => this.orkanStore.setActivePath(path),
			isEditMode: () => {
				const {isActive, isModifierKeyDown} = this.obState;
				return isActive && this.orkanStore.isAdmin() && isModifierKeyDown
			},
			openModal: (...props) => this.orkanStore && this.orkanStore.openModal(...props)
		}};
	}

	componentWillMount(){

		// this.activate();
		keyboard.bind('hold:1000:' + ACTIVATION_EVENT_KEY, this.activate);

		document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);

		// does not fire with normal api
		document.body.onblur = this.handleBlur;
	}

	@autobind
	async activate(){
		const {store, auth} = this.props;

		if(this.obState.isActive){
			return;
		}

		this.obState.isBusy = true;
		try{
			const fetchUrl = process.env.NODE_ENV === 'development'
				?'http://localhost:8081/orkan-admin.js'
				:'https://firebasestorage.googleapis.com/v0/b/my-proj-5cbb6.appspot.com/o/admin%2Forkan-admin.js?alt=media&token=c798a38c-9479-42b7-81f9-3a70a0d9d436';

			const response = await fetch(fetchUrl);
			eval(await response.text());
			OrkanAdmin = window[ORKAN_ADMIN_GLOBAL].default;
			delete window[ORKAN_ADMIN_GLOBAL];

			this.orkanStore = new OrkanStore(store, auth);
			this.obState.isActive = true;
		}catch(err){
			console.error(err);
		}

		setTimeout(() => {
			this.obState.isBusy = false;

		}, 500)

		window.a = this.orkanStore;
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
			(isActive || isBusy) && ReactDOM.createPortal(<OrkanIndicator isBusy={isBusy || (this.orkanStore && this.orkanStore.isInitiating)} />, document.body),
			isActive && ReactDOM.createPortal(<OrkanAdmin store={this.orkanStore} />, document.body)
		];
	}
}



/*
	=load sequence

	idle: provider/injector, firebase store, simple getValue logic

	active Orkan pre-auth: auth ui, auth logic

	active Orkan post-auth: all ui, all logic

	=

	OrkanProvider + orkanInjector
	DataStore
	AuthStore
	OrkanAdmin
	OrkanStore
*/