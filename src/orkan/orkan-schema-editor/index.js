import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import map from 'lodash/map';
import isObject from 'lodash/isObject';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';

import './style.scss';
import OrkanActionButton from '../orkan-action-button';
import Input from '../controls/input';
import {COLLECTION_KEY} from '../constants';
import OrkanIcon from '../icon';


@observer
export default class OrkanSchemaEditor extends Component{
	static propTypes = {
		value: PropTypes.object
	};

	@observable obState = {
		createPath: null,
		createValue: null,
		openPaths: ['']
	};

	@autobind
	handleKeyPress(e){
		const {onChange, value} = this.props;
		const {createPath, createValue} = this.obState;

		if(e.key === 'Enter'){
			const clone = cloneDeep(value);
			const fullPath = createPath + '.' + createValue;
			set(clone, fullPath, 'string');
			onChange(clone);
			// this.obState.createPath = null;
			this.obState.createValue = null;
		}else if(e.key === 'Esc'){
			this.obState.createPath = null;
			this.obState.createValue = null;
		}
	}

	@autobind
	handleBlur(){
		this.obState.createPath = null;
		this.obState.createValue = null;
	}



	@autobind
	handleRemoveField(path){
		const {onChange, value} = this.props;
		if(!confirm('are you sure?')){
			return;
		}
		const clone = cloneDeep(value);
		set(clone, path, null)
		onChange(clone);
		this.obState.createPath = null;
		this.obState.createValue = null;
	}

	togglePath(path){
		const {value} = this.props;
		const {openPaths} = this.obState;

		// if(path && !isObject(get(value, path))){
		// 	return;
		// }
		if(this.isPathOpen(path)){
			openPaths.remove(path);
		}else{
			openPaths.push(path);
		}

	}

	isPathOpen(path){
		const {openPaths} = this.obState;
		return openPaths.includes(path);
	}

	renderField(key, field, parentPath){
		const {createPath, createValue, openPaths} = this.obState;

		const currentPath = [parentPath, key].filter(it => !!it).join('.');
		const isPathOpen = openPaths.includes(currentPath);

		const className = classNames('OrkanSchemaEditor-field', {
			'OrkanSchemaEditor-field-open': isPathOpen
		});

		const isFieldPrimitive = !isObject(field);

		return (
			<div key={key} className={className}>
				<div className='OrkanSchemaEditor-field-label'>

					{!isFieldPrimitive && <OrkanIcon type='arr' onClick={() => this.togglePath(currentPath)}/>}

					<div className="OrkanSchemaEditor-field-name" onClick={() => this.togglePath(currentPath)}>
						{key || 'Root'}
					</div>

					<div className="OrkanSchemaEditor-field-actions">
						{currentPath &&
							<OrkanActionButton icon='trash' onClick={() => this.handleRemoveField(currentPath)}/>
						}
						{!field[COLLECTION_KEY] &&
							<OrkanActionButton icon='plus' onClick={() =>{
								this.obState.createPath = currentPath;
								!this.isPathOpen(currentPath) && this.togglePath(currentPath);
							}}/>
						}
					</div>
				</div>
				<div className='OrkanSchemaEditor-field-children' style={{height: isPathOpen?'auto':0}}>
					{createPath === currentPath &&
						<div className='OrkanSchemaEditor-field-create'>
							<Input autoFocus
							   placeholder='Field name'
							   value={createValue}
							   onChange={value => this.obState.createValue = value}
							   onKeyPress={this.handleKeyPress}
							   onBlur={this.handleBlur}/>
						</div>
					}
					{!isFieldPrimitive && map(field, (value, key) => this.renderField(key, value, currentPath))}
				</div>
			</div>
		);
	}
	render(){
		const {className, value} = this.props;

		const newClassName = classNames('OrkanSchemaEditor', className);
		return (
			<div className={newClassName}>
				{this.renderField(null, value, null)}
			</div>
		);
	}
}