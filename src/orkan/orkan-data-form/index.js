import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {isObject, map} from 'lodash';
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

import './style.scss';
import {MediaSingleControl} from '../controls/media-single';


@observer
export default class OrkanDataForm extends Component{

	static propTypes = {
		formStore: PropTypes.instanceOf(FormStore).isRequired,
		editPath: PropTypes.string.isRequired,
		onSubmit: PropTypes.func,
		onCancel: PropTypes.func,
		getFieldSettings: PropTypes.func,
		schema: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
		getData: PropTypes.func
	};

	static defaultProps = {
		onSubmit: () => null,
		onCancel: () => null,
		getData: () => null
	};

	@observable obState = {
		isBusy: false
	};

	componentWillMount(){

	}

	getEditPathPrimitiveKeys(){
		const {schema} = this.props;
		return Object.keys(schema)
			.filter(key => !isObject(schema[key]))
	}

	isSchemaPrimitive(){
		const {schema} = this.props;
		return !isObject(schema);

	}

	@autobind
	async handleSubmit(...props){
		const {onSubmit} = this.props;

		const promise = onSubmit(...props);
		if(promise.then){
			this.obState.isBusy = true;
			await promise;
			this.obState.isBusy = false;
		}
	}


	renderControl(path){
		const {getFieldSettings} = this.props;

		const {uiType, uiSize, dataSource, dataSourcePath, dataSourceLabel, dataSourceValue, dataSourceOptions} = getFieldSettings(path) || {};

		switch(uiType){
			default:
				return <InputControl/>;
			case 'textarea':
				return <TextareaControl rows={uiSize || 3}/>;
			case 'datetime':
				return <DatePickerControl/>;
			case 'checkbox':
				return <CheckboxControl/>;
			case 'select':
				if(dataSource === 'static'){
					return <SelectControl options={dataSourceOptions}/>;
				}else if(dataSource === 'dynamic'){
					return <DynamicSelectControl optionsPath={dataSourcePath} optionsLabel={dataSourceLabel} optionsValue={dataSourceValue}/>;
				}else{
					return null;
				}
			case 'media':
				return <MediaSingleControl/>

		}
	}

	renderFormFields(){
		const {editPath, onSettings} = this.props;

		if(!this.isSchemaPrimitive()){
			return this.getEditPathPrimitiveKeys()
				.map((key, i) => (
					<FormField compact key={key} label={'/' + key} name={`${editPath}.${key}`} onSettings={() => onSettings(`${editPath}/${key}`)}>
						{this.renderControl(`${editPath}/${key}`)}
					</FormField>
				))
		}else{
			const editPathParts = editPath.split('/');
			return (
				<FormField compact key={editPath} label={'/' + editPathParts[editPathParts.length-1]} name={editPath} onSettings={() => onSettings(editPath)}>
					{this.renderControl(editPath)}
				</FormField>
			);
		}
	}


	render(){
		const {className, formStore} = this.props;
		const {isBusy} = this.obState;

		if(!this.getEditPathPrimitiveKeys().length){
			return null;
		}

		const newClassName = classNames('OrkanDataForm', className);

		return (
			<Form className={newClassName} store={formStore} onSubmit={this.handleSubmit}>
				<span/>
				{this.renderFormFields()}
				<div className="OrkanDataForm-actions">
					<SubmitButton primary disabled={!formStore.isDirty} isBusy={isBusy}>Save Changes</SubmitButton>
				</div>
			</Form>
		);
	}
}