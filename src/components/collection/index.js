import React, {Component, cloneElement} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import classNames from 'classnames'
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import inject from '../../inject';

import style from './style';
import {createStyle} from '../../utils/style-utils';


/**
* A component for rendering collections. expects a path and a render function. the render function receives the collection item as an argument.
*/
@inject(({path, orderBy, where, limit}) => {
	return {
		collection: {path, orderBy, where, limit}
	};
})
@withStyles(style)
@observer
export default class Collection extends Component{
	static propTypes = {
		/**
		 * the path of the data in the database.
		*/
		path: PropTypes.string.isRequired,
		/**
		 * will be called when the data is available, expects it to return a renderable value. (collectionItem) => ReactNode
		 */
		renderItem: PropTypes.func,
		/**
		 * will render the edit overlay in alternate colors to support different color schemes.
		 */
		lightOverlay: PropTypes.bool,
		/**
		 * define Firestore's ordering rules
		 */
		orderBy: PropTypes.objectOf(PropTypes.oneOf(['asc', 'desc'])),
		/**
		 * define Firestore's filtering rules
		 */
		where: PropTypes.objectOf(
			PropTypes.shape({
				'==': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
				'!=': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
				'>=': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
				'<=': PropTypes.oneOfType([PropTypes.string, PropTypes.number])
			})
		),
		/**
		 * define Firestore's limit
		 */
		limit: PropTypes.number
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

		const cleanCollection = collection.filter(it => !!it);

		return (
			<div className={s.root}>
				{cleanCollection.map(item => {
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