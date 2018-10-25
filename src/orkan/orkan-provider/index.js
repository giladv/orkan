import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';

import {ACTIVATION_EVENT_KEY, REACT_CONTEXT_NAME,} from '../constants';
import {keyboard} from '../utils/keyboard-utils';
import FirebaseStore from '../firebase-store';
import OrkanIndicator from '../orkan-indicator';
import OrkanStore from '../orkan-store';


let OrkanAdmin;


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
		this.activate();
		keyboard.bind('hold:1000:' + ACTIVATION_EVENT_KEY, this.activate);

		document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);

		// does not fire with normal api
		document.body.onblur = this.handleBlur;
	}

	@autobind
	async activate(){
		const {store, auth} = this.props;

		this.obState.isBusy = true;
		try{
			OrkanAdmin = (await import(/* webpackChunkName: "orkan-admin" */'../orkan-admin')).default;
			this.orkanStore = new OrkanStore(store, auth);
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