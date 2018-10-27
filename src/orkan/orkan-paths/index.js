import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import OrkanHeader from '../orkan-header';
import Input from '../controls/input';
import orkanInject from '../orkan-inject';
import OrkanListItem from '../orkan-list-item';
import {typeOrFalse} from '../utils/prop-types-utils';

import './style.scss';
import OrkanIcon from '../orkan-icon';
import Button from '../button';
import DropdownContainer from '../dropdown-container';
import OrkanStore from '../orkan-store';


@orkanInject(({path, store}) => {
	return store.isPathCollection(path)?{value: path}:{};

}, {liveEditedData: false})
@observer
export default class OrkanPaths extends Component{

	static propTypes = {
		path: PropTypes.string.isRequired,
		showHeader: PropTypes.bool,
		store: PropTypes.instanceOf(OrkanStore).isRequired,
	};

	static defaultProps = {
		showHeader: true
	};

	@observable obState = {
		newKey: '',
		isOptionsOpen: false
	};

	@autobind
	handleCreate(){
		const {path} = this.props;
		const {newKey} = this.obState;
		store.createCollectionItem(path, newKey);
		this.obState.newKey = '';
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



	renderPaths(){
		const {store, path, value} = this.props;

		if(store.isPathCollection(path) && value){
			const {collectionMainLabel, collectionImage} = store.getSettingsByPath(path);

			return Object.keys(value).map(key => (
				<OrkanListItem
					key={key}
					image={collectionImage && value[key][collectionImage]}
					onClick={() => this.handleClickPath(key)}
					buttons={[
						{icon: 'trash', onClick: (e) => this.handleRemove(e, key)}
					]}>

					{collectionMainLabel?value[key][collectionMainLabel]:'/'+key}
				</OrkanListItem>
			))
		}else{
			return store.getNonPrimitiveKeysByPath(path, true).map(key => (
				<OrkanListItem key={key} onClick={() => this.handleClickPath(key)}>/{key}</OrkanListItem>
			));
		}
	}

	render(){
		const {store, path, showHeader} = this.props;
		const {newKey, isOptionsOpen} = this.obState;

		const options = [
			{label: 'Settings', value: 'settings'},
			{label: 'Clear collection', value: 'clear'},
		];

		const isPathCollection = store.isPathCollection(path);
		const nonPrimitiveKeysExist = store.getNonPrimitiveKeysByPath(path, true).length > 0;
		const primitiveKeysExist = store.getPrimitiveKeysByPath(path, true).length > 0;

		return (
			<div className='OrkanPaths'>
				{showHeader && !isPathCollection && nonPrimitiveKeysExist && primitiveKeysExist &&
					<OrkanHeader title='Other Paths'/>
				}
				{isPathCollection &&
					<div className='OrkanPaths-header'>
						<DropdownContainer
							options={options}
							isOpen={isOptionsOpen}
							onSelect={this.handleSelectOption}
							onClose={() => this.obState.isOptionsOpen = false}
							onFocus={() => this.obState.isOptionsOpen = true}>
							<OrkanIcon type='dots'/>
						</DropdownContainer>
						<Input placeholder='key (optional)' value={newKey} onChange={value => this.obState.newKey = value}/>
						<Button primary onClick={this.handleCreate}>create</Button>
					</div>
				}
				{this.renderPaths()}
			</div>
		);
	}
}





