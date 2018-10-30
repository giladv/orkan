import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import isObject from 'lodash/isObject';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import Form, {FormField} from '../form/index';
import FormStore from '../form/form-store';
import {InputControl} from '../controls/input/index';
import {SubmitButton} from '../button';
import {TextareaControl} from '../controls/textarea';
import {DatePickerControl} from '../controls/date-picker';
import {DynamicSelectControl, SelectControl} from '../controls/select';
import {CheckboxControl} from '../controls/checkbox';
import {ColorPickerControl} from '../controls/color-picker';
import {MediaControl} from '../controls/media';
import {SwitchControl} from '../controls/switch';
import {SliderControl} from '../controls/slider';
import {WysiwygControl} from '../controls/wysiwyg';
import OrkanStore from '../orkan-store';

import './style.scss';


@observer
export default class OrkanDataForm extends Component{

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


	renderControl(path){
		const {store} = this.props;
		const {uiType, uiSize, dataSource, dataSourcePath, dataSourceLabel, dataSourceValue, dataSourceOptions, fromValue, toValue} = store.getSettingsByPath(path) || {};

		switch(uiType){
			default:
				return <InputControl/>;
			case 'textarea':
				return <TextareaControl rows={uiSize || 3}/>;
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
				return <MediaControl/>;
			case 'color':
				return <ColorPickerControl/>

		}
	}

	renderFormFields(){
		const {store} = this.props;

		if(!store.isPathPrimitive(store.activePath)){
			return store.getPrimitiveKeysByPath(store.activePath)
				.map((key, i) => (
					<FormField compact key={key} label={'/' + key} name={`${store.activePath}.${key}`} onSettings={() => store.setSettingsPath(`${store.activePath}/${key}`)}>
						{this.renderControl(`${store.activePath}/${key}`)}
					</FormField>
				))
		}else{
			const activePathParts = store.activePath.split('/');
			return (
				<FormField compact key={store.activePath} label={'/' + activePathParts[activePathParts.length-1]} name={store.activePath} onSettings={() => store.setSettingsPath(store.activePath)}>
					{this.renderControl(store.activePath)}
				</FormField>
			);
		}
	}


	render(){
		const {className, store} = this.props;
		const {isBusy} = this.obState;

		if(!store.getPrimitiveKeysByPath(store.activePath).length){
			return null;
		}

		const newClassName = classNames('OrkanDataForm', className);

		return (
			<Form className={newClassName} store={store.dataFormStore} onSubmit={this.handleSubmit}>
				<span/>
				{this.renderFormFields()}
				<div className="OrkanDataForm-actions">
					<SubmitButton primary disabled={!store.dataFormStore.isDirty} isBusy={isBusy}>Save Changes</SubmitButton>
				</div>
			</Form>
		);
	}
}