import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import {createStyle} from '../../utils/style-utils';
import CodeBlock from '../code-block';

import style from './style';







export default class Markdown extends Component{
	static propTypes = {
		value: PropTypes.string
	};

	render(){
		const {className, value, ...otherProps} = this.props;
		const s = createStyle(style, className);
		return (
			<ReactMarkdown source={value} renderers={{
					code: CodeBlock
				}}/>
		);
	}
}

