import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui'
import uniqueId from 'lodash/uniqueId';

import {createStyle} from '../utils/style-utils';

import 'firebaseui/dist/firebaseui.css';
import style from './style.scss';





@observer
export default class FirebaseAuth extends Component{

	static propTypes = {
		auth: PropTypes.object.isRequired,
		onSuccess: PropTypes.func
	};

	static defaultProps = {
		onSuccess: () => null
	};

	componentWillMount(){
		const {onSuccess} = this.props;

		this.domId = 'FirebaseAuth_' + uniqueId();
		this.uiConfig = {
			// Popup signin flow rather than redirect flow.
			signInFlow: 'popup',
			callbacks: {
				signInSuccessWithAuthResult: (e) => {
					// without this the ui will disappear after any successful login
					// onSuccess(e.user);
					if(!this.isUnmounted){
						this.ui.reset();
						this.ui.start('#' + this.domId, this.uiConfig);
					}
				}
			},
			// We will display Google and Facebook as auth providers.
			signInOptions: [
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			]
		};
	}

	componentDidMount(){
		const {auth} = this.props;
		this.ui = new firebaseui.auth.AuthUI(auth);
		// The start method will wait until the DOM is loaded.
		this.ui.start('#' + this.domId, this.uiConfig);
	}

	componentWillUnmount(){
		this.isUnmounted = true;
		this.ui.reset();
		this.ui.delete();
	}

	render(){
		const {className} = this.props;
		const s = createStyle(style, className);

		return (
			<div id={this.domId} className={s.root}/>
		);
	}
}