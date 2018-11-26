import React, { Component } from 'react';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import parsePropTypes from 'parse-prop-types'

import {createStyle} from '../../utils/style-utils';
import Icon from '../icon';

import style from './style';

@observer
export default class PropsTable extends Component{
	static propTypes = {
		component: PropTypes.instanceOf(Component),
		descriptions: PropTypes.object
	};

	getStyle(){
		const {className} = this.props;

		return createStyle(style, className);

	}
	renderType(type){
		const s = this.getStyle();
		switch(type.name){
			case 'shape':
				return (
					<div>
						object {'{'}
						{Object.keys(type.value).map(key =>
							<div key={key} className={classNames(s.typeColumn, s.typeIndent)}>'{key}':&nbsp;{this.renderType(type.value[key].type)}</div>
						)}
						{'}'}
					</div>
				);
			case 'arrayOf':
				return (
					<div>
						array[
						<div className={classNames(s.typeColumn, s.typeIndent)}>
							{this.renderType(type.value)}, ...
						</div>
						]
					</div>
				);
			case 'objectOf':
				return (
					<div>
						object {'{'}
							<div className={classNames(s.typeColumn, s.typeIndent)}>[any]: {this.renderType(type.value)}</div>
						{'}'}
			 		</div>
			 	);
			case 'oneOfType':
				return (
					<div>
						{type.value.map(subType => this.renderType(subType)).join('|')}
					</div>
				);
			case 'oneOf':
				return type.value.map(item => typeof item === 'string'?"'" + item + "'":item).join('|');
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
		const {component, descriptions} = this.props;

		const s = this.getStyle();


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


