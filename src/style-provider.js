import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const isNode = new Function("try {return this===global;}catch(e){return false;}");

export default class StyleProvider extends Component{
	static childContextTypes = {
		insertCss: PropTypes.func,
	};

	getChildContext() {
		const {onCss} = this.props;

		return {
			insertCss: (...styles) => {
				const removeCss = styles.map(x => {
					if(isNode()){
						const css = x._getCss();
						onCss(css);
						return css;
					}else{
						return x._insertCss({prepend: true});
					}
				});
				return () => {
					removeCss.forEach(f => f());
				};
			}
		};
	}

	render() {
		return this.props.children;
	}
}