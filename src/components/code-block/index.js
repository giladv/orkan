import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Refractor from 'react-refractor'
import jsx from 'refractor/lang/jsx'
// import 'prismjs/themes/prism-twilight'
import {createStyle} from '../../utils/style-utils';

import style from './style';

Refractor.registerLanguage(jsx);






export default class CodeBlock extends Component{
	static propTypes = {
		value: PropTypes.string,
		language: PropTypes.oneOf(['jsx'])
	};

	static defaultProps = {
		language: 'jsx'
	};

	render(){
		const {className, value, language, ...otherProps} = this.props;
		const s = createStyle(style, className);
		return (
			<div {...otherProps} className={s.root}>
				<Refractor language={language || 'jsx'} value={value || ''} />
			</div>
		);
	}
}

