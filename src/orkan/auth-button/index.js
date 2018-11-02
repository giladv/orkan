import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';

import {createStyle} from '../utils/style-utils';

import style from './style.scss';
import Icon from '../icon';

@observer
export default class AuthButton extends Component{

	static propTypes = {
		provider: PropTypes.oneOf(['facebook', 'google', 'github']),
	};

	static defaultProps = {
	};

	render(){
		const {className, provider, classes, ...otherProps} = this.props;
		const s = createStyle(style, className, classes, style[provider]);

		return (
			<div {...otherProps} className={s.root}>
				{provider === 'google' && <img className={s.icon} src={require('./google-logo.svg')}/>}
				{provider !== 'google' && <Icon className={s.icon} type={provider}/>}
				Sign in with&nbsp;<span className={s.providerName}>{provider}</span>
			</div>
		);
	}
}
