import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import {createStyle} from '../../utils/style-utils';
import inject from '../../inject';

import style from './style';


/**
 * A component for rendering simple values by their path.
 */
@inject(props => {
	return {
		value: props.path
	};
})
@withStyles(style)
@observer
export default class Value extends Component{
	static propTypes = {
		/**
		 * the path of the data in the database.
		 */
		path: PropTypes.string.isRequired,
		/**
		 * if set to true, will render the value as html, perfect for WYSIWYG purposes.
		 */
		html: PropTypes.bool,
		/**
		 * will render the edit overlay in alternate colors to support different color schemes.
		 */
		lightOverlay: PropTypes.bool,
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




