import React, {Component, cloneElement} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';

import inject from '../inject';
import {createStyle} from '../utils/style-utils';

import style from './style';


@inject(props => {
	return {
		value: props.path
	};
})
@observer
export default class WithValue extends Component{
	static propTypes = {
		path: PropTypes.string.isRequired,
		lightOverlay: PropTypes.bool,
		render: PropTypes.func
	};

	static defaultProps = {
		lightOverlay: false
	};

	@autobind
	handleClick(e){
		const {onClick, path, orkan} = this.props;
		if(orkan.isEditMode()){
			orkan.setActivePath(path);
			e.preventDefault();
			e.stopPropagation();
		}else{
			onClick && onClick(e);
		}
	}

	render(){
		const {className, value, render, orkan, lightOverlay} = this.props;

		if(!value){
			return null;
		}

		const renderedValue = render(value);

		const s = createStyle(style, className, renderedValue.props.className, {
			root: {
				editMode: orkan.isEditMode(),
				lightOverlay
			}
		});

		return cloneElement(renderedValue, {className: s.root, onClick: this.handleClick});
	}
}
