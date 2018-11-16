import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';

import ActionButton from '../action-button';
import {typeOrFalse} from '../utils/prop-types-utils';
import Img from '../img';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';

@observer
export default class ListEmptyItem extends Component{
	static propTypes = {
		message: PropTypes.string
	};

	static defaultProps = {
		message: 'nothing to show'
	};

	render(){
		const {className, classes, message, ...otherProps} = this.props;
		const s = createStyle(style, className, classes);

		return (
			<div {...otherProps} className={s.root}>
				{message}
			</div>
		);
	}
}