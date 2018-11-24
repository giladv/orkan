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
import classNames from 'classnames';

import ActionButton from '../action-button';
import Input, {InputControl} from '../controls/input';
import {toDotPath} from '../firestore';
import Form from '../form';
import FormField from '../form-field';
import {validFirestoreKey} from '../form-validators';
import FormStore from '../form/form-store';
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
		openPaths: ['']
	};

	createFormStore = new FormStore({}, {key: [validFirestoreKey()]});

	@autobind
	handleKeyPress(e){
		const {createPath} = this.obState;

		if(e.key === 'Esc'){
			this.obState.createPath = null;
			this.createFormStore.reset({});
		}
	}

	@autobind
	handleBlur(){
		// this.obState.createPath = null;
		this.createFormStore.reset({});
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
		if(parentPath && isEmpty(get(clone, parentPath))){
			set(clone, parentPath, true);
		}

		onChange(clone);
		this.obState.createPath = null;
		this.createFormStore.reset({});
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
		const {openPaths} = this.obState;

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

	getStyle(){
		const {className, classes} = this.props;
		return createStyle(style, className, classes);
	}

	@autobind
	handleCreateFormSubmit(){
		const {onChange, value} = this.props;
		const {createPath} = this.obState;
		const createValue = this.createFormStore.get('key');
		const clone = cloneDeep(value);
		const fullPath = [createPath, createValue].filter(it => !!it).join('.'); // createPath might be empty for root
		set(clone, fullPath, createPath === ''?[{}]:true);

		onChange(clone);
		this.createFormStore.reset({});
	}

	renderCreate(placeholder = 'Field name'){
		const s = this.getStyle();
		return (
			<Form className={s.fieldCreate} store={this.createFormStore} onSubmit={this.handleCreateFormSubmit}>
				<FormField name='key' className={s.fieldCreateField}>
					<InputControl autoFocus
						   placeholder={placeholder}
						   onKeyPress={this.handleKeyPress}
						   onBlur={this.handleBlur}/>
				</FormField>
			</Form>
		);
	}

	renderField(key, field, parentPath){
		const {createPath, openPaths} = this.obState;

		const isArray = Array.isArray(field);

		const currentPath = [parentPath, key].filter(it => !!it).join('.');
		const isPathOpen = openPaths.includes(currentPath);

		const s = this.getStyle();

		const className = classNames(s.field, {
			[s.openField]: isPathOpen,
			[s.rootField]: !parentPath || parentPath === 'objects'
		});

		const isFieldPrimitive = !isObject(field);

		return (
			<div key={key} className={className}>
				{key &&
					<div className={s.fieldContent}>

						{!isFieldPrimitive && <Icon className={s.fieldToggleIcon} type='arr' onClick={() => this.togglePath(currentPath)}/>}

						<div className={s.fieldLabel} onClick={() => this.togglePath(currentPath)}>
							{key}
						</div>

						<div className={s.fieldActions}>
							{currentPath &&
								<ActionButton className={s.fieldActionButton} tooltip='Remove' icon='trash' onClick={() => this.handleRemoveField(currentPath)}/>
							}
							<ActionButton
								icon='plus'
								tooltip='Add child'
								className={s.fieldActionButton}
								onClick={() => {
									this.obState.createPath = isArray?currentPath + '.0':currentPath;
									!this.isPathOpen(currentPath) && this.togglePath(currentPath);
								}}/>
							{parentPath !== 'objects' &&
								<ActionButton
									tooltip='Toggle array'
									className={classNames(s.fieldActionButton, isArray && s.persistentAction)}
									icon='array'
									onClick={() => this.handleToggleArray(currentPath)}
									disabled={!parentPath}
									active={isArray}/>
							}
						</div>
					</div>
				}
				<div className={s.fieldChildren} style={{height: isPathOpen?'auto':0}}>
					{createPath === (isArray?currentPath + '.0':currentPath) &&
						this.renderCreate()
					}
					{!isFieldPrimitive && map(isArray?field[0]:field, (value, key) => this.renderField(key, value, isArray?currentPath + '.0':currentPath))}
				</div>
			</div>
		);
	}
	render(){
		const {value} = this.props;
		const {createPath} = this.obState;

		const s = this.getStyle();

		return (
			<div className={s.root}>
				<Header title='Objects' actionIcon='plus' onActionClick={() => this.obState.createPath = 'objects'}/>
				{createPath === 'objects' && <div className={s.rootCreate}>{this.renderCreate('Object name')}</div>}
				<div>
					{map(value.objects, (field, key) => this.renderField(key, field, 'objects'))}
				</div>
				<Header title='Collections' actionIcon='plus' onActionClick={() => this.obState.createPath = ''}/>
				{createPath === '' && <div className={s.rootCreate}>{this.renderCreate('Collection name')}</div>}
				<div>
					{map(omit(value, 'objects'), (field, key) => this.renderField(key, field, null))}
				</div>
			</div>
		);
	}
}