import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import map from 'lodash/map';
import {OBJECTS_KEY} from '../constants';

import Form from '../form';
import FormField from '../form-field';
import {validFirestoreKey} from '../form-validators';
import FormStore from '../form/form-store';
import Header from '../header';
import {InputControl} from '../controls/input';
import inject from '../inject';
import ListEmptyItem from '../list-empty-item';
import ListItem from '../list-item';
import Icon from '../icon';
import {SubmitButton} from '../button';
import DropdownContainer from '../dropdown-container';
import OrkanStore from '../orkan-store';
import Tooltip from '../tooltip';
import {stripRootFromPath} from '../utils/path-utils';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';


@inject(({path}) => {
	const sanitizedPath = stripRootFromPath(path);
	if(sanitizedPath === OBJECTS_KEY){
		return {};
	}
	return {value: sanitizedPath};

}, {liveEditedData: false})
@observer
export default class Paths extends Component{

	static propTypes = {
		path: PropTypes.string.isRequired,
		showHeader: PropTypes.bool,
		store: PropTypes.instanceOf(OrkanStore).isRequired,
	};

	static defaultProps = {
		showHeader: true
	};

	createFormStore = new FormStore({}, {key: [validFirestoreKey()]});

	@autobind
	handleCreate(){
		const {path, store} = this.props;
		if(store.isPathCollection(path)){
			store.createCollectionKey(path, this.createFormStore.get('key'));
		}else{
			store.createArrayKey(path);
		}

		this.createFormStore.reset();
	}

	@autobind
	handleClickPath(key){
		const {path, store} = this.props;
		store.setActivePath(path + '/' + key)
	}

	@autobind
	handleRemove(e, key){
		const {store, path} = this.props;

		if(!confirm('are you sure?')){
			return;
		}

		store.removeIterableItem(path + '/' + key);
		e.stopPropagation();
	}

	@autobind
	handleremoveIterableItem(key){
		const {store} = this.props;

		if(!confirm('are you sure?')){
			return;
		}

		store.removeIterableItem(key);
	}

	getStyle(){
		const {className, classes} = this.props;
		return createStyle(style, className, classes);
	}

	renderPaths(){
		const {store, path, value, isPathLoading} = this.props;

		if(store.isPathCollection(path) || store.isPathArray(path)){
			const {labelField, imageField} = store.getSettingsByPath(path) || {};

			if(!value || !value.length){
				return <ListEmptyItem isBusy={isPathLoading.value}/>
			}

			return map(value, (item, key) => {
				const itemKey = item.$key || key;
				return <ListItem
					key={itemKey}
					image={imageField && value[key][imageField]}
					onClick={() => this.handleClickPath(itemKey)}
					buttons={[
						{icon: 'clone', onClick: (e) => this.handleRemove(e, itemKey), tooltip: 'Clone'},
						{icon: 'trash', onClick: (e) => this.handleRemove(e, itemKey), tooltip: 'Remove'},
					]}>

					{labelField ? value[key][labelField] : '/' + itemKey}
				</ListItem>
			})
		}else{
			return store.getNonPrimitiveKeysByPath(path, true).map(key => (
				<ListItem key={key} onClick={() => this.handleClickPath(key)}>/{key}</ListItem>
			));
		}
	}

	render(){
		const {store, path, showHeader} = this.props;

		const isPathCollection = store.isPathCollection(path);
		const isPathArray = store.isPathArray(path);
		const nonPrimitiveKeysExist = store.getNonPrimitiveKeysByPath(path, true).length > 0;
		const primitiveKeysExist = store.getPrimitiveKeysByPath(path, true).length > 0;

		const s = this.getStyle();

		return (
			<div className={s.root}>
				{showHeader && !isPathCollection && nonPrimitiveKeysExist && primitiveKeysExist &&
					<Header title='Other Paths'/>
				}
				{(isPathCollection || isPathArray) &&
					<div className={s.collectionHeader}>
						<Tooltip content='Settings'>
							<Icon className={s.collectionHeaderSettingsIcon} type='dots' onClick={() => store.setSettingsPath(path)}/>
						</Tooltip>
						<Form store={this.createFormStore} onSubmit={this.handleCreate} className={s.createForm}>
							{isPathCollection &&
								<FormField name='key' className={s.createFormInput}>
									<InputControl placeholder='key (optional)'/>
								</FormField>
							}
							<SubmitButton primary>create</SubmitButton>
						</Form>
					</div>
				}
				{this.renderPaths()}
			</div>
		);
	}
}





