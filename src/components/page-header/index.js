import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Value from '../../orkan/value';
import WithValue from '../../orkan/with-value';

import {createStyle} from '../../utils/style-utils';
import Img from '../img';

import style from './style';


export default class PageHeader extends Component{
	static propTypes = {
		basePath: PropTypes.string
	};
	render(){
		const {className, basePath, ...otherProps} = this.props;
		const s = createStyle(style, className, {
			root: {
			}
		});

		return (
			<div {...otherProps} className={s.root}>
				<WithValue path={`${basePath}/background`} lightOverlay render={value => <Img className={s.img} mode='cover' src={value}/>}/>
				<h2 className={s.title}><Value html lightOverlay path={`${basePath}/title`}/></h2>
			</div>
		);
	}
}



