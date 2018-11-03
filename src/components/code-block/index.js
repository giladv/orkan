import React, { Component } from 'react';
import PropTypes from 'prop-types';

import highlight from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import Highlight from 'react-highlight/lib/optimized';
import {createStyle} from '../../utils/style-utils';

import style from './style';

highlight.registerLanguage('javascript', javascript);

export default class CodeBlock extends Component{
	static propTypes = {
		value: PropTypes.string
	};
	render(){
		const {className, children, ...otherProps} = this.props;
		const s = createStyle(style, className);
		return (
			<div {...otherProps} className={s.root}>
				<Highlight>
					{children}
				</Highlight>
			</div>
		);
	}
}



