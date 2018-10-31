import React, {Component, cloneElement} from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';

import orkanInject from '../orkan-inject';

import style from './style';
import {createStyle} from '../utils/style-utils';


@orkanInject(props => {
	return {
		collection: props.path
	};
})
@observer
export default class Collection extends Component{
	static propTypes = {
		path: PropTypes.string.isRequired,
		renderItem: PropTypes.func
	};

	static defaultProps = {
		renderItem: () => null
	};

	@autobind
	handleClick(e, key){
		const {onClick, path, orkan} = this.props;

		if(orkan.isEditMode()){
			orkan.setActivePath(`${path}/${key}`);
			e.preventDefault();
			e.stopPropagation();
		}else{
			onClick && onClick(e);
		}
	}

	render(){
		const {className, classes, renderItem, collection, orkan} = this.props;

		const s = createStyle(style, className, classes, {
			item: {
				editMode: orkan.isEditMode()
			}
		});

		return (
			<div className={s.root}>
				{map(collection, (item, key) => cloneElement(renderItem(item, key), {className: s.item, onClick: e => this.handleClick(e, key)}))}
			</div>
		);
	}
}