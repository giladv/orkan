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
		const s = createStyle(style, className);

		const isComponent = isEntityComponent(api.entity);
		// !isComponent && console.log(api.entity.toString().split(/[\(\{\,]/g)));
		return (
			<div className={s.root}>
				<h2>{api.entity.name} <span>{isComponent?'Component':'Function'}</span></h2>
				<p>{api.description}</p>
				{isComponent && <PropsTable className={s.propsTable} component={api.entity}/>}
			</div>
		);
	}
}


const apiMap = {
	inject: {
		entity: inject,
		description: 'A function and a decorator, used to inject data to components.'
	},
	Provider: {
		entity: Provider,
		description: 'The root of every Orkan app, provides a react contextual api to every other orkan component in the tree.'
	},
	Value: {
		entity: Value.decoratedComponent
	},
	WithValue: {
		entity: WithValue.decoratedComponent
	},
	Collection: {
		entity: Collection.decoratedComponent
	}
};


const isEntityComponent = entity => entity.prototype instanceof Component;