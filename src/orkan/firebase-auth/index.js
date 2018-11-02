import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import firebase from 'firebase/app';

import {createStyle} from '../utils/style-utils';
import AuthButton from '../auth-button';

import style from './style.scss';





@observer
export default class FirebaseAuth extends Component{

	static propTypes = {
		providers: PropTypes.arrayOf(PropTypes.oneOf(['facebook', 'google', 'github'])),
		onSuccess: PropTypes.func
	};

	static defaultProps = {
		providers: ['google', 'facebook', 'github'],
		onSuccess: () => null
	};

	componentDidMount(){
		const {auth} = this.props;

		this.firebaseProviders = {
			google: new firebase.auth.GoogleAuthProvider(),
			facebook: new firebase.auth.FacebookAuthProvider(),
			github: new firebase.auth.GithubAuthProvider()
		};
	}

	componentWillUnmount(){
		this.isUnmounted = true;
	}

	handleProviderClick(provider){
		const firebaseProvider = this.firebaseProviders[provider];
		firebase.auth().signInWithPopup(firebaseProvider).then(function(result) {
			console.log(user)
		}).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// The email of the user's account used.
			var email = error.email;
			// The firebase.auth.AuthCredential type that was used.
			var credential = error.credential;

		});
	}

	render(){
		const {className, providers, classes} = this.props;
		const s = createStyle(style, className, classes);
		return (
			<div className={s.root}>
				{providers.map((provider, i) => (
					<AuthButton key={i} className={s.authButton} provider={provider} onClick={() => this.handleProviderClick(provider)}/>
				))}
			</div>
		);
		return (
			<div id={this.domId} className={s.root}/>
		);
	}
}