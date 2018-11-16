import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import map from 'lodash/map';

import Form from '../form';
import FormStore from '../form/form-store';
import Header from '../header';
import {InputControl} from '../controls/input';
import inject from '../inject';
import ListItem from '../list-item';
import Icon from '../icon';
import {SubmitButton} from '../button';
import DropdownContainer from '../dropdown-container';
import OrkanStore from '../orkan-store';
import {stripRootFromPath} from '../utils/path-utils';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';


@inject(({path}) => {
	console.log('?!', path)
	const sanitizedPath = stripRootFromPath(path);
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

	@observable obState = {
		isOptionsOpen: false
	};

	createFormStore = new FormStore({}, {});

	@autobind
	handleCreate(){
		const {path, store} = this.props;
		store.createCollectionItem(path, this.createFormStore.get('key'));
		this.createFormStore.reset();
	}

	@autobind
	handleClickPath(key){
		const {path, store} = this.props;
		console.log('set active', path + '/' + key)
		store.setActivePath(path + '/' + key)
	}

	@autobind
	handleRemove(e, key){
		const {store, path} = this.props;

		if(!confirm('are you sure?')){
			return;
		}

		store.removeCollectionItem(path + '/' + key);
		e.stopPropagation();
	}

	@autobind
	handleSelectOption(option){
		const {store, path} = this.props;
		this.obState.isOptionsOpen = false;
		switch(option.value){
			case 'settings':
				store.setSettingsPath(path);
		}
	}

	@autobind
	handleRemoveCollectionItem(key){
		const {store} = this.props;

		if(!confirm('are you sure?')){
			return;
		}

		store.removeCollectionItem(key);
	}

	getStyle(){
		const {className, classes} = this.props;
		return createStyle(style, className, classes);
	}

	renderPaths(){
		const {store, path, value} = this.props;

		if(value && (store.isPathCollection(path) || store.isPathArray(path))){
			const {collectionMainLabel, collectionImage} = store.getSettingsByPath(path) || {};

			return map(value, (item, key) => {
				const itemKey = item.$key || key;
				return <ListItem
					key={itemKey}
					image={collectionImage && value[key][collectionImage]}
					onClick={() => this.handleClickPath(itemKey)}
					buttons={[
						{icon: 'clone', onClick: (e) => this.handleRemove(e, itemKey)},
						{icon: 'trash', onClick: (e) => this.handleRemove(e, itemKey)},
					]}>

					{collectionMainLabel ? value[key][collectionMainLabel] : '/' + itemKey}
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
		const {isOptionsOpen} = this.obState;

		const options = [
			{label: 'Settings', value: 'settings'},
			{label: 'Clear collection', value: 'clear'},
		];

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
						<DropdownContainer
							className={s.collectionHeaderDropdown}
							options={options}
							isOpen={isOptionsOpen}
							onSelect={this.handleSelectOption}
							onClose={() => this.obState.isOptionsOpen = false}
							onFocus={() => this.obState.isOptionsOpen = true}>
							<Icon className={s.collectionHeaderDropdownIcon} type='dots'/>
						</DropdownContainer>
						<Form store={this.createFormStore} onSubmit={this.handleCreate} className={s.createForm}>
							{isPathCollection &&
								<InputControl className={s.createFormInput} placeholder='key (optional)' name='key'/>
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





