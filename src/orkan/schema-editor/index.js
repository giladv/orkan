import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import map from 'lodash/map';
import isObject from 'lodash/isObject';
import set from 'lodash/set';
import get from 'lodash/get';
import unset from 'lodash/unset';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';

import ActionButton from '../action-button';
import Input from '../controls/input';
import {COLLECTION_KEY} from '../constants';
import {toDotPath} from '../firestore';
import Header from '../header';
import Icon from '../icon';
import {getParentPath} from '../utils/path-utils';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';


@observer
export default class SchemaEditor extends Component{
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
			const fullPath = [createPath, createValue].filter(it => !!it).join('.'); // createPath might be empty for root
			set(clone, fullPath, true);
			console.log(fullPath, clone)
			onChange(clone);
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

		const parentPath = toDotPath(getParentPath(path));
		const clone = cloneDeep(value);
		unset(clone, path);
		if(isEmpty(get(clone, parentPath))){
			set(clone, parentPath, true);
		}
		console.log(clone, path, parentPath)
		onChange(clone);
		this.obState.createPath = null;
		this.obState.createValue = null;
	}

	@autobind
	handleToggleArray(path){
		const {onChange, value} = this.props;

		const clone = cloneDeep(value);
		const pathValue = get(clone, path);
		let newPathValue;

		if(Array.isArray(pathValue)){
			newPathValue = pathValue[0] || true;
		}else if(pathValue){
			newPathValue = [pathValue];
		}else{
			newPathValue = [];
		}

		set(clone, path, newPathValue);
		onChange(clone);
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
		const {className, classes} = this.props;
		const {createPath, createValue, openPaths} = this.obState;

		const isArray = Array.isArray(field);
		// field = isArray?field[0]:field;

		const currentPath = [parentPath, key].filter(it => !!it).join('.');
		const isPathOpen = openPaths.includes(currentPath);

		const s = createStyle(style, className, classes, {
			field: {
				openField: isPathOpen,
				rootField: !parentPath || parentPath === 'objects'
			}
		});

		const isFieldPrimitive = !isObject(field);

		return (
			<div key={key} className={s.field}>
				{key &&
					<div className={s.fieldContent}>

						{!isFieldPrimitive && <Icon className={s.fieldToggleIcon} type='arr' onClick={() => this.togglePath(currentPath)}/>}

						<div className={s.fieldLabel} onClick={() => this.togglePath(currentPath)}>
							{key}
						</div>

						<div className={s.fieldActions}>
							{currentPath &&
								<ActionButton className={s.fieldActionButton} icon='trash' onClick={() => this.handleRemoveField(currentPath)}/>
							}
							{!field[COLLECTION_KEY] &&
								<ActionButton
									icon='plus'
									className={s.fieldActionButton}
									onClick={() => {
										this.obState.createPath = isArray?currentPath + '.0':currentPath;
										!this.isPathOpen(currentPath) && this.togglePath(currentPath);
									}}/>
							}
							<ActionButton className={s.fieldActionButton} icon='array' onClick={() => this.handleToggleArray(currentPath)} active={isArray}/>
						</div>
					</div>
				}
				<div className={s.fieldChildren} style={{height: isPathOpen?'auto':0}}>
					{createPath === (isArray?currentPath + '.0':currentPath) &&
						<div className={s.fieldCreate}>
							<Input autoFocus
								className={s.fieldCreateInput}
								placeholder='Field name'
								value={createValue}
								onChange={value => this.obState.createValue = value}
								onKeyPress={this.handleKeyPress}
								onBlur={this.handleBlur}/>
						</div>
					}
					{!isFieldPrimitive && map(isArray?field[0]:field, (value, key) => this.renderField(key, value, isArray?currentPath + '.0':currentPath))}
				</div>
			</div>
		);
	}
	render(){
		const {className, classes, value} = this.props;
		const s = createStyle(style, className, classes);
		return (
			<div className={s.root}>
				<Header title='Objects'/>
				<div>
					{map(value.objects, (field, key) => this.renderField(key, field, 'objects'))}
				</div>
				<Header title='Collections'/>
				<div>
					{map(omit(value, 'objects'), (field, key) => this.renderField(key, field, null))}
				</div>
			</div>
		);
	}
}