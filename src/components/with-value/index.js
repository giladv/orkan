import React, {Component, cloneElement} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import inject from '../../inject';
import {createStyle} from '../../utils/style-utils';

import style from './style';

/**
 * A components for rendering any value, expects a path and a render function. the render function receives the value as an argument.
 */
@inject(props => {
	return {
		value: props.path
	};
})
@withStyles(style)
@observer
export default class WithValue extends Component{
	static propTypes = {
		/**
		 * the path of the data in the database.
		 */
		path: PropTypes.string.isRequired,
		/**
		 * will render the edit overlay in alternate colors to support different color schemes.
		 */
		lightOverlay: PropTypes.bool,
		/**
		 * will be called when the data is available, expects it to return a renderable value. (value) => ReactNode
		 */
		render: PropTypes.func
	};

	static defaultProps = {
		lightOverlay: false
	};

	@autobind
	handleClick(e, originalHandler){
		const {path, orkan} = this.props;
		if(orkan.isEditMode()){
			orkan.setActivePath(path);
			e.preventDefault();
			e.stopPropagation();
		}else{
			originalHandler && originalHandler(e);
		}
	}

	render(){
		const {className, value, render, orkan, lightOverlay} = this.props;

		if(!value){
			return null;
		}

		const renderedValue = render(value);

		if(!renderedValue){
			return null;
		}

		const s = createStyle(style, className, renderedValue.props.className, {
			root: {
				editMode: orkan.isEditMode(),
				lightOverlay
			}
		});

		return cloneElement(renderedValue, {className: s.root, onClick: e => this.handleClick(e, renderedValue.props.onClick)});
	}
}
