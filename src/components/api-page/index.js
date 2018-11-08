import React, { Component } from 'react';
import {withRouter} from 'react-router';
import {observer} from 'mobx-react';

import Collection from '../../orkan/collection';
import inject from '../../orkan/inject';
import Value from '../../orkan/value';
import WithValue from '../../orkan/with-value';
import Provider from '../../orkan/provider';
import {createStyle} from '../../utils/style-utils';
import PropsTable from '../props-table';

import style from './style';

@withRouter
@observer
export default class ApiPage extends Component{

	render(){
		const {className, params} = this.props;
		const api = apiMap[params.entityId];

		if(!api){
			return;
		}

		const s = createStyle(style, className);

		const isComponent = isEntityComponent(api.entity);
		console.log(api)
		// !isComponent && console.log(api.entity.toString().split(/[\(\{\,]/g)));
		return (
			<div className={s.root}>
				<h2>{api.name} <span>{isComponent?'Component':'Function'}</span></h2>
				<p>{api.description}</p>
				<h3>{isComponent?'Props':'Arguments'}</h3>
				{<PropsTable className={s.propsTable} component={api.entity} descriptions={api.props}/>}
			</div>
		);
	}
}


const apiMap = {
	inject: {
		name: 'inject',
		entity: inject,
		description: 'A function and a decorator, used to inject data to components.',
		props: {
			mapPropsToPaths: 'A function which receives the props as an arguments and expects an object of paths to require.',
			options: 'configuration object. see table below for more details.'
		}
	},
	Provider: {
		name: 'Provider',
		entity: Provider,
		description: 'The root of every Orkan app, provides a react contextual api to every other orkan component in the tree.',
		props: {
			firebaseConfig: 'Firebase config object copied from the Firebase console.',
			basePath: 'The base path relative to your Firebase database root, in which the system will operate on.',
			authProviders: 'a list of authentication providers to support. (further configuration required on the Firebase console)'
		}
	},
	Value: {
		name: 'Value',
		description: 'A component for rendering simple values by their path.',
		entity: Value.decoratedComponent,
		props: {
			path: 'the path the data in the database.',
			html: 'if set to true, will render the value as html, perfect for WYSIWYG purposes.',
			lightOverlay: 'will render the edit overlay in alternate colors to support different color schemes.'
		}
	},
	WithValue: {
		description: 'A components for rendering any value, expects a path and a render function. the render function receives the value as an argument.',
		name: 'WithValue',
		entity: WithValue.decoratedComponent,
		props: {
			path: 'the path the data in the database.',
			lightOverlay: 'will render the edit overlay in alternate colors to support different color schemes.',
			render: 'will be called when the data is available, expects it to return a renderable value. (value) => ReactNode'
		}
	},
	Collection: {
		description: 'A component for rendering collections. expects a path and a render function. the render function receives the collection item as an argument.',
		name: 'Collection',
		entity: Collection.decoratedComponent,
		props: {
			path: 'the path the data in the database.',
			lightOverlay: 'will render the edit overlay in alternate colors to support different color schemes.',
			renderItem: 'will be called when the data is available, expects it to return a renderable value. (collectionItem) => ReactNode'
		}
	}
};


const isEntityComponent = entity => entity.prototype instanceof Component;