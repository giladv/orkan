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
		component: PropTypes.instanceOf(Component)
	};
	render(){
		const {className, component} = this.props;

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
				{map(parsePropTypes(component), (value, key) =>
					<tr key={key}>
						<td>{key}</td>
						<td>{value.type.name}</td>
						<td className={s.centeredCell}>{value.required && <Icon type='v'/>}</td>
						<td></td>
						<td></td>
					</tr>
				)}
			</table>
		);
	}
}


