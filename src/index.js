import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory, hashHistory} from 'react-router';
import firebase from 'firebase';

require("firebase/database");
require("firebase/auth");


import './css/style.scss';
import App from './components/app';
import Template from './components/template';

import FirebaseStore from './orkan/firebase-store';
import OrkanProvider from './orkan/orkan-provider';

const config = {
	apiKey: "AIzaSyDyI8G7yNDCYb7qNUORm7sw6iXoIHkS5qQ",
	authDomain: "my-proj-5cbb6.firebaseapp.com",
	databaseURL: "https://my-proj-5cbb6.firebaseio.com",
	projectId: "my-proj-5cbb6",
	storageBucket: "my-proj-5cbb6.appspot.com",
	messagingSenderId: "548566086285"
};

const firebaseApp = firebase.initializeApp(config);
firebase.auth();

const database = firebaseApp.database();


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