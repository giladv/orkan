import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';

import {createStyle} from '../utils/style-utils';
import Icon from '../icon';

import style from './style.scss';

@observer
export default class ActionButton extends Component{
	static propTypes = {
		icon: PropTypes.string,
		active: PropTypes.bool
	};

	static defaultProps = {
	};

	render(){
		const {className, icon, active, ...otherProps} = this.props;
		const s = createStyle(style, className, {
			root: {
				active
			}
		});

		return (
			<Icon {...otherProps} className={s.root} type={icon} />
		);
	}
}