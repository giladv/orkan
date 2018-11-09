import React, {Component, cloneElement} from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import omitBy from 'lodash/omitBy';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import classNames from 'classnames'

import inject from '../inject';

import style from './style';
import {createStyle} from '../utils/style-utils';

@inject(({path, orderByChild}) => {
	return {
		collection: {path, orderByChild}
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
		renderItem: () => null,
		lightOverlay: false
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
		console.log('##', collection)

		return (
			<div className={s.root}>
				{map(cleanCollection, (item, key) => {
					const renderedItem = renderItem(item, key);
					if(!renderedItem){
						return null;
					}

					if(typeof renderedItem === 'object'){
						return cloneElement(renderedItem, {key, className: classNames(s.item, renderedItem.props.className), onClick: e => this.handleClick(e, key)});
					}else{
						return renderedItem;
					}
				})}
			</div>
		);
	}
}