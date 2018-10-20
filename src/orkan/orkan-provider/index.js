import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';

import {ACTIVATION_EVENT_KEY, REACT_CONTEXT_NAME,} from '../constants';
import {keyboard} from '../utils/keyboard-utils';
import FirebaseStore from '../firebase-store';


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
		isActive: false,
		isBusy: false,
	};

	getChildContext() {
		return {[REACT_CONTEXT_NAME]: {
			getValue: () => null,
			store: this.props.store,
			isEditMode: () => false

		}};
	}

	componentWillMount(){

		keyboard.bind('hold:1000:' + ACTIVATION_EVENT_KEY, async () => {
			this.obState.isBusy = true;
			try{
				OrkanAdmin = (await import(/* webpackChunkName: "orkan-admin" */'../orkan-admin')).default;
				this.obState.isActive = true;
			}catch(err){
				console.error(err);
			}
			this.obState.isBusy = false;
		});
	}

	render() {
		const {children, store, auth} = this.props;
		const {isActive} = this.obState;

		return [
			children,
			isActive && ReactDOM.createPortal(<OrkanAdmin store={store} auth={auth} />, document.body)
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