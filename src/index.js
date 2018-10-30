import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory, hashHistory} from 'react-router';
import firebase from 'firebase/app';

import 'firebase/database';
import 'firebase/auth'
import 'firebase/storage'

import App from './components/app';
import Template from './components/template';

import './css/style.scss';

import {OrkanProvider, FirebaseStore} from './orkan';


// Firebase setup
const config = {
	apiKey: "AIzaSyDyI8G7yNDCYb7qNUORm7sw6iXoIHkS5qQ",
	authDomain: "my-proj-5cbb6.firebaseapp.com",
	databaseURL: "https://my-proj-5cbb6.firebaseio.com",
	projectId: "my-proj-5cbb6",
	storageBucket: "my-proj-5cbb6.appspot.com",
	messagingSenderId: "548566086285"
};

const firebaseApp = firebase.initializeApp(config);
const database = firebaseApp.database();
// end of Firebase setup

const firebaseStore = new FirebaseStore(database, 'test');


ReactDOM.render(
	<OrkanProvider store={firebaseStore} auth={firebaseApp.auth()}>
		<Router history={hashHistory}>
			<Route path="/" component={App}/>
			<Route path="/template" component={Template}/>
		</Router>
	</OrkanProvider>,
	document.getElementById('root')
);