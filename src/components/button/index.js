import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router/lib/Link';

import {createStyle} from '../../utils/style-utils';

import style from './style';


export default class Button extends Component{
	static propTypes = {
		primary: PropTypes.bool
	};
	render(){
		const {className, children, primary, ...otherProps} = this.props;
		const s = createStyle(style, className, {
			root: {
				primary
			}
		});
		return (
			<Link {...otherProps} className={s.root}>
				{children}
			</Link>
		);
	}
}



