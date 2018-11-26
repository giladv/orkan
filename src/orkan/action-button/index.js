import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import Tooltip from '../tooltip';

import {createStyle} from '../utils/style-utils';
import Icon from '../icon';

import style from './style.scss';

@observer
export default class ActionButton extends Component{
	static propTypes = {
		icon: PropTypes.string,
		active: PropTypes.bool,
		disabled: PropTypes.bool,
		tooltip: PropTypes.node
	};

	static defaultProps = {
	};

	render(){
		const {className, icon, active, disabled, tooltip, ...otherProps} = this.props;
		const s = createStyle(style, className, {
			root: {
				active,
				disabled
			}
		});

		return (
			<Tooltip content={tooltip} disabled={!tooltip || disabled}>
				<Icon {...otherProps} className={s.root} type={icon} />
			</Tooltip>
		);
	}
}