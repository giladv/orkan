import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';

import Icon from '../icon';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';

@observer
export default class Header extends Component{

	static propTypes = {
		primary: PropTypes.bool,
		title: PropTypes.any,
		actionIcon: PropTypes.string,
		onActionClick: PropTypes.string,
	};

	static defaultProps = {
		actionIcon: 'close'
	};

	render(){
		const {className, onActionClick, actionIcon, title, primary} = this.props;

		const s = createStyle(style, className, {
			root: {
				primary
			}
		});

		return (
			<h2 className={s.root}>
				<div className={s.title}>{title}</div>
				{onActionClick && <Icon className={s.icon} type={actionIcon} onClick={onActionClick}/>}
			</h2>
		);
	}
}