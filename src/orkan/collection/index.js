import React, {Component, cloneElement} from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import omitBy from 'lodash/omitBy';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import classNames from 'classnames'

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
		renderItem: PropTypes.func,
		lightOverlay: PropTypes.bool,
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
		const {className, classes, renderItem, collection, orkan, lightOverlay} = this.props;

		const s = createStyle(style, className, classes, {
			item: {
				editMode: orkan.isEditMode(),
				lightOverlay
			}
		});

		const cleanCollection = omitBy(collection, it => !it);

		return (
			<div className={s.root}>
				{map(cleanCollection, (item, key) => {
					const renderedItem = renderItem(item, key);
					return cloneElement(renderedItem, {className: classNames(s.item, renderedItem.props.className), onClick: e => this.handleClick(e, key)});
				})}
			</div>
		);
	}
}