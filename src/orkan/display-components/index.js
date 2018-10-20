import React, {Component, cloneElement} from 'react';
import PropTypes from 'prop-types';
import {map} from 'lodash';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import classNames from 'classnames';

import orkanInject from '../orkan-inject';

import './style';

@orkanInject(props => {
	return {
		value: props.path
	};
})
@observer
export class Value extends Component{
	static propTypes = {
		path: PropTypes.string.isRequired
	};

	@autobind
	handleClick(e){
		const {onClick, path, orkan} = this.props;
		if(orkan.isEditMode() && orkan.isActive() && orkan.isAdmin()){
			orkan.setActivePath(path);
			e.preventDefault();
			e.stopPropagation();
		}else{
			onClick && onClick(e);
		}
	}

	render(){
		const {className, value, children, orkan} = this.props;
		const newClassName = classNames('Value', className, {
			'Orkan-edit-mode': orkan.isEditMode() && orkan.isActive() && orkan.isAdmin()
		});

		return <span className={newClassName} onClick={this.handleClick}>{value || children}</span>;
	}
}




@orkanInject(props => {
	return {
		value: props.path
	};
})
@observer
export class WithValue extends Component{
	static propTypes = {
		path: PropTypes.string.isRequired,
		render: PropTypes.func
	};

	@autobind
	handleClick(e){
		const {onClick, path, orkan} = this.props;
		if(orkan.isEditMode() && orkan.isActive() && orkan.isAdmin()){
			orkan.setActivePath(path);
			e.preventDefault();
			e.stopPropagation();
		}else{
			onClick && onClick(e);
		}
	}

	render(){
		const {className, value, render, orkan} = this.props;

		if(!value){
			return null;
		}

		const renderedValue = render(value);

		const newClassName = classNames('WithValue', className, renderedValue.props.className, {
			'Orkan-edit-mode': orkan.isEditMode() && orkan.isActive() && orkan.isAdmin(),
		});

		return cloneElement(renderedValue, {className: newClassName, onClick: this.handleClick});
	}
}




@orkanInject(props => {
	return {
		collection: props.path
	};
})
@observer
export class Collection extends Component{
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

		if(orkan.isEditMode() && orkan.isActive() && orkan.isAdmin()){
			orkan.setActivePath(`${path}/${key}`);
			e.preventDefault();
			e.stopPropagation();
		}else{
			onClick && onClick(e);
		}
	}

	render(){
		const {className, renderItem, collection, orkan} = this.props;
		const newClassName = classNames('Collection', className, {
			'Orkan-edit-mode': orkan.isEditMode() && orkan.isActive() && orkan.isAdmin()
		});
		const itemClassName = classNames('Collection-item', {
			'Orkan-edit-mode': orkan.isEditMode() && orkan.isActive() && orkan.isAdmin()
		});
		return (
			<div className={newClassName}>
				{map(collection, (item, key) => cloneElement(renderItem(item, key), {className: itemClassName, onClick: e => this.handleClick(e, key)}))}
			</div>
		);
	}
}