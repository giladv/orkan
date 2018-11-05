import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';

import {createStyle} from '../utils/style-utils';
import orkanInject from '../orkan-inject';

import style from './style';

@orkanInject(props => {
	return {
		value: props.path
	};
})
@observer
export default class Value extends Component{
	static propTypes = {
		path: PropTypes.string.isRequired,
		html: PropTypes.bool,
		lightOverlay: PropTypes.bool,
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
		const {className, value, children, orkan, isPathLoading, html, lightOverlay} = this.props;


		if(isPathLoading.value){
			return '...';
		}

		const s = createStyle(style, className, {
			root: {
				editMode: orkan.isEditMode(),
				lightOverlay
			}
		});

		if(html){
			return <span className={s.root} dangerouslySetInnerHTML={{__html: value || children}} onClick={this.handleClick}/>;
		}else{
			return <span className={s.root} onClick={this.handleClick}>{value || children}</span>;
		}
	}
}




