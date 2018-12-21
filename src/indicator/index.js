import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import {createStyle} from '../utils/style-utils';

import style from './style';

@withStyles(style)
export default class Indicator extends Component{
	static propTypes = {
		isBusy: PropTypes.bool,
		color: PropTypes.oneOf(['default', 'dark'])
	};

	static defaultProps = {
		color: 'default'
	};

	render(){
		const {className, isBusy, color} = this.props;

		const s = createStyle(style, className, {
			root: {
				notBusy: !isBusy, // without this stupid thing, css animations wont stop!
				busy: isBusy,
				dark: color === 'dark'
			}
		});

		return <div className={s.root}/>
	}
}