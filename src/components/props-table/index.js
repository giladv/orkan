import React, { Component } from 'react';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import parsePropTypes from 'parse-prop-types'
import Icon from '../../orkan/icon';

import {createStyle} from '../../utils/style-utils';

import style from './style';

@observer
export default class PropsTable extends Component{
	static propTypes = {
		component: PropTypes.instanceOf(Component),
		descriptions: PropTypes.object
	};

	renderType(type){
		switch(type.name){
			case 'shape':
				return (
					<div>
						object {'{'}
						{Object.keys(type.value).map(key =>
							<div key={key}>{key}: {this.renderType(type.value[key].type)}</div>
						)}
						{'}'}
					</div>
				);
			case 'arrayOf':
				return (
					<div>
						array[{this.renderType(type.value)}, ...]
					</div>
				);
			case 'oneOf':
				return type.value.join('|');
			case 'func':
				return 'function';
			default:
				return type.name;
		}
	}

	renderDefaultProp(key){
		const {component} = this.props;
		const defaultProp = component.defaultProps[key];

		if(defaultProp === undefined || typeof defaultProp === 'function'){
			return;
		}

		return JSON.stringify(defaultProp).replace(/\"/g, "'")
	}
	render(){
		const {className, component, descriptions} = this.props;

		const s = createStyle(style, className);


		return (
			<table className={s.root}>
				<thead className={s.header}>
					<tr>
						<th>Name</th>
						<th>Type</th>
						<th>Required</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{map(parsePropTypes(component), (value, key) =>
						<tr key={key}>
							<td>{key}</td>
							<td className={s.typeCell}>{this.renderType(value.type)}</td>
							<td className={s.centeredCell}>{value.required && <Icon type='v'/>}</td>
							<td>{this.renderDefaultProp(key)}</td>
							<td>{descriptions[key]}</td>
						</tr>
					)}
				</tbody>
			</table>
		);
	}
}


