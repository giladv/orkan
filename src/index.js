import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';

import './css/style.scss';

import {OrkanProvider} from './orkan';


// config copied from Firebase console
const config = {
	apiKey: "AIzaSyDyI8G7yNDCYb7qNUORm7sw6iXoIHkS5qQ",
	authDomain: "my-proj-5cbb6.firebaseapp.com",
	databaseURL: "https://my-proj-5cbb6.firebaseio.com",
	projectId: "my-proj-5cbb6",
	storageBucket: "my-proj-5cbb6.appspot.com",
	messagingSenderId: "548566086285"
};


ReactDOM.render(
	<OrkanProvider firebaseConfig={config}>
		<App/>
	</OrkanProvider>,
	document.getElementById('root')
);