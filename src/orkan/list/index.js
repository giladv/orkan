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

@inject(({path}) => {
	return {
		collection: path
	};
})
@observer
export default class List extends Component{
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

		const cleanList = omitBy(collection, it => !it);
		return (
			<div className={s.root}>
				{map(cleanList, (item) => {
					const renderedItem = renderItem(item, item.$key);
					if(!renderedItem){
						return null;
					}

					if(typeof renderedItem === 'object'){
						return cloneElement(renderedItem, {key: item.$key, className: classNames(s.item, renderedItem.props.className), onClick: e => this.handleClick(e, item.$key)});
					}else{
						return renderedItem;
					}
				})}
			</div>
		);
	}
}