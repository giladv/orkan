import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import {OBJECTS_KEY, USERS_KEY} from '../constants';

import Form from '../form';
import FormField from '../form-field';
import {InputControl} from '../controls/input';
import {SubmitButton} from '../button';
import {TextareaControl} from '../controls/textarea';
import {DatePickerControl} from '../controls/date-picker';
import {SelectControl} from '../controls/select';
import {CheckboxControl} from '../controls/checkbox';
import {ColorPickerControl} from '../controls/color-picker';
import {MediaControl} from '../controls/media';
import {SwitchControl} from '../controls/switch';
import {SliderControl} from '../controls/slider';
import {WysiwygControl} from '../controls/wysiwyg';
import {DynamicSelectControl} from '../controls/dynamic-select';
import OrkanStore2 from '../orkan-store2';
import {toAbsolutePath} from '../utils/path-utils';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';


@observer
export default class DataForm extends Component{

	static propTypes = {
		store: PropTypes.instanceOf(OrkanStore2).isRequired,
	};

	static defaultProps = {
	};

	@observable obState = {
		isBusy: false
	};

	componentWillMount(){

	}

	@autobind
	async handleSubmit(){
		const {store} = this.props;

		this.obState.isBusy = true;
		try{
			await store.submitData();
		}catch(e){
			console.log(e)
		}
		this.obState.isBusy = false;
	}

	getStyle(){
		const {className, classes} = this.props;
		return createStyle(style, className, classes);
	}

	hasPermissions(){
		const {store} = this.props;
		return store.activePath.startsWith(toAbsolutePath(USERS_KEY))
			|| store.activePath.startsWith(toAbsolutePath(OBJECTS_KEY))
			|| store.canEditData;
	}

	isSubmitDisabled(){
		const {store} = this.props;
		return !this.hasPermissions() || !store.dataFormStore.isDirty;
	}


	renderControl(path){
		const {store} = this.props;
		const {uiType, uiSize, dataSource, dataSourcePath, dataSourceLabel, dataSourceValue, dataSourceOptions, fromValue, toValue, isCodeFriendly} = store.getLiveSettingsByPath(path) || {};

		const s = this.getStyle();
		const autoFocus = store.activePrimitive === path;

		switch(uiType){
			default:
				return <InputControl autoFocus={autoFocus}/>;
			case 'textarea':
				return <TextareaControl rows={uiSize || 3} codeFriendly={isCodeFriendly} autoFocus={autoFocus} />;
			case 'number':
				return <InputControl type='number' autoFocus={autoFocus}/>;
			case 'datetime':
				return <DatePickerControl autoFocus={autoFocus}/>;
			case 'checkbox':
				return <CheckboxControl autoFocus={autoFocus}/>;
			case 'switch':
				return <SwitchControl autoFocus={autoFocus}/>;
			case 'wysiwyg':
				return <WysiwygControl style={{height: 42 + (uiSize || 3) * 15 + 'px'}} autoFocus={autoFocus}/>;
			case 'slider':
				return <SliderControl min={fromValue || 0} max={toValue || 10} autoFocus={autoFocus}/>;
			case 'select':
				if(dataSource === 'static'){
					return <SelectControl options={dataSourceOptions} autoFocus={autoFocus}/>;
				}else if(dataSource === 'dynamic'){
					return <DynamicSelectControl autoFocus={autoFocus} optionsPath={dataSourcePath} optionsLabel={dataSourceLabel} optionsValue={dataSourceValue}/>;
				}else{
					return null;
				}
			case 'media':
				return <MediaControl className={s.mediaControl}/>;
			case 'color':
				return <ColorPickerControl/>

		}
	}

	renderFormFields(){
		const {store} = this.props;

		const s = this.getStyle();


		if(!store.isPathPrimitive(store.activePath, true)){
			return store.getPrimitiveKeysByPath(store.activePath, true)
				.map((key, i) => (
					<FormField compact disabled={!this.hasPermissions()} key={key} className={s.formField} label={'/' + key} name={`${store.activePath}.${key}`} onSettings={() => store.setSettingsPath(`${store.activePath}/${key}`)}>
						{this.renderControl(`${store.activePath}/${key}`)}
					</FormField>
				))

		}else{
			const activePathParts = store.activePath.split('/');
			return (
				<FormField compact disabled={!this.hasPermissions()} key={store.activePath} className={s.formField} label={'/' + activePathParts[activePathParts.length-1]} name={store.activePath} onSettings={() => store.setSettingsPath(store.activePath)}>
					{this.renderControl(store.activePath)}
				</FormField>
			);
		}
	}


	render(){
		const {store} = this.props;
		const {isBusy} = this.obState;

		if(store.isPathCollection(store.activePath) || !store.getPrimitiveKeysByPath(store.activePath, true).length){
			return null;
		}

		const s = this.getStyle();


		return (
			<Form className={s.root} store={store.dataFormStore} onSubmit={this.handleSubmit}>
				<span/>
				{this.renderFormFields()}
				<div className={s.actions}>
					<SubmitButton primary disabled={this.isSubmitDisabled()} isBusy={isBusy}>Save Changes</SubmitButton>
				</div>
			</Form>
		);
	}
}