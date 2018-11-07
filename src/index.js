import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory, IndexRedirect, IndexRoute, Route, Router} from 'react-router';
import "parse-prop-types"


import ApiPage from './components/api-page';
import App from './components/app';
import DocPage from './components/doc-page';
import Docs from './components/docs';
import Home from './components/home';

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
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={Home}/>
				<Route path="docs" component={Docs}>
					<IndexRedirect to='getting-started'/>

					<Route path='api/:entityId' component={ApiPage}/>
					<Route path=':pageId' component={DocPage}/>
				</Route>
			</Route>
		</Router>
	</OrkanProvider>,
	document.getElementById('root')
);