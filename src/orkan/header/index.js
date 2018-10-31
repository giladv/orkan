import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import Button from '../button';
import Icon from '../icon';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';

console.log(style)
@observer
export default class Header extends Component{

	static propTypes = {
		primary: PropTypes.bool,
		title: PropTypes.any,
		onClose: PropTypes.func,
		onCreate: PropTypes.func,
	};

	static defaultProps = {
	};

	render(){
		const {className, onClose, title, primary} = this.props;

		const s = createStyle(style, className, {
			root: {
				primary
			}
		});

		return (
			<h2 className={s.root}>
				<div className={s.title}>{title}</div>
				{onClose && <Icon className={s.icon} type='close' onClick={onClose}/>}
			</h2>
		);
	}
}