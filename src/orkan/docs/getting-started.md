Before we begin, make sure to read [what orkan.js is](docs/what-is-orkan).
also, we assume you are familiar with React.js and have already created a Firebase account.

### Prerequisites
- React.js v16.0 +
- Mobx v4.0 +
- Firebase js SDK v4.5.0+



### Hello World
Before we begin with the code, lets make sure we install out dependencies

with yarn:
```
yarn add react react-dom mobx firebase orkan 
```

with npm:
```
npm install --save react react-dom mobx firebase orkan 
```


Next, lets write a simple React app
```jsx
import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';

class App extends PureComponent {
   render() {
	  return (
		 <div>
			 Hello World
		 </div>
	  );
   }
}

ReactDOM.render(
	<App/>,
	document.getElementById('root')
);
```

Finally lets integrate Orkan.js.

First, we need to import the Orkan Provider and the Value components. 
also, let's paste the configuration object we received from Firebase:
```jsx
import OrkanProvider from 'orkan/provider';
import Value from 'orkan/value';

const firebaseConfig = {
	apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
	authDomain: "xxxxxxxxxxxxxxxx.firebaseapp.com",
	databaseURL: "https://xxxxxxxxxx.firebaseio.com",
	projectId: "xxxxxxxxxxxxxx",
	storageBucket: "xxxxxxxxxxxxx.appspot.com",
	messagingSenderId: "00000000000000"
};
````

next, we wrap our App with the Provider
```jsx
ReactDOM.render(
	<OrkanProvider firebaseConfig={firebaseConfig}>
		<App/>
	</OrkanProvider>,
	document.getElementById('root')
);
``` 

and replace that hard coded greeting with something dynamic
```jsx
class App extends React.Component {
   render() {
	  return (
		 <div>
			 <Value path='objects/home/greeting'/>
		 </div>
	  );
   }
}
```


and all together:
```jsx
import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import OrkanProvider from 'orkan/provider';
import Value from 'orkan/value';

const firebaseConfig = {
	apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
	authDomain: "xxxxxxxxxxxxxxxx.firebaseapp.com",
	databaseURL: "https://xxxxxxxxxx.firebaseio.com",
	projectId: "xxxxxxxxxxxxxx",
	storageBucket: "xxxxxxxxxxxxx.appspot.com",
	messagingSenderId: "00000000000000"
};

class App extends React.Component {
   render() {
	  return (
		 <div>
			 <Value path='objects/home/greeting'/>
		 </div>
	  );
   }
}

ReactDOM.render(
	<OrkanProvider firebaseConfig={firebaseConfig}>
		<App/>
	</OrkanProvider>,
	document.getElementById('root')
);

```

Done!

### Next - [Setup the admin](docs/admin-setup).
