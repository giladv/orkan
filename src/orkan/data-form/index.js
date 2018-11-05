import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';

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
import OrkanStore from '../orkan-store';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';


@observer
export default class DataForm extends Component{

	static propTypes = {
		store: PropTypes.instanceOf(OrkanStore).isRequired,
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
		await store.submitData();
		this.obState.isBusy = false;
	}

	getStyle(){
		const {className, classes} = this.props;
		return createStyle(style, className, classes);
	}


	renderControl(path){
		const {store} = this.props;
		const {uiType, uiSize, dataSource, dataSourcePath, dataSourceLabel, dataSourceValue, dataSourceOptions, fromValue, toValue} = store.getSettingsByPath(path) || {};

		const s = this.getStyle();

		switch(uiType){
			default:
				return <InputControl/>;
			case 'textarea':
				return <TextareaControl rows={uiSize || 3} codeFriendly/>;
			case 'number':
				return <InputControl type='number'/>;
			case 'datetime':
				return <DatePickerControl/>;
			case 'checkbox':
				return <CheckboxControl/>;
			case 'switch':
				return <SwitchControl/>;
			case 'wysiwyg':
				return <WysiwygControl style={{height: 42 + (uiSize || 3) * 15 + 'px'}}/>;
			case 'slider':
				return <SliderControl min={fromValue || 0} max={toValue || 10}/>;
			case 'select':
				if(dataSource === 'static'){
					return <SelectControl options={dataSourceOptions}/>;
				}else if(dataSource === 'dynamic'){
					return <DynamicSelectControl optionsPath={dataSourcePath} optionsLabel={dataSourceLabel} optionsValue={dataSourceValue}/>;
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
					<FormField compact key={key} className={s.formField} label={'/' + key} name={`${store.activePath}.${key}`} onSettings={() => store.setSettingsPath(`${store.activePath}/${key}`)}>
						{this.renderControl(`${store.activePath}/${key}`)}
					</FormField>
				))
		}else{
			const activePathParts = store.activePath.split('/');
			return (
				<FormField compact key={store.activePath} className={s.formField} label={'/' + activePathParts[activePathParts.length-1]} name={store.activePath} onSettings={() => store.setSettingsPath(store.activePath)}>
					{this.renderControl(store.activePath)}
				</FormField>
			);
		}
	}


	render(){
		const {store} = this.props;
		const {isBusy} = this.obState;

		if(!store.getPrimitiveKeysByPath(store.activePath, true).length){
			return null;
		}

		const s = this.getStyle();


		return (
			<Form className={s.root} store={store.dataFormStore} onSubmit={this.handleSubmit}>
				<span/>
				{this.renderFormFields()}
				<div className={s.actions}>
					<SubmitButton primary disabled={!store.dataFormStore.isDirty} isBusy={isBusy}>Save Changes</SubmitButton>
				</div>
			</Form>
		);
	}
}