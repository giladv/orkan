import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import Form, {FormField} from '../form/index';
import FormStore from '../form/form-store';

import {SubmitButton} from '../button';
import {SelectControl} from '../controls/select';
import {InputControl} from '../controls/input';
import OrkanHeader from '../orkan-header';

import './style.scss';
import {SliderControl} from '../controls/slider';


@observer
export default class OrkanSettingsPanel extends Component{

	static propTypes = {
		formStore: PropTypes.instanceOf(FormStore).isRequired,
		editPath: PropTypes.string.isRequired,
		isCollectionPath: PropTypes.bool,
		onSubmit: PropTypes.func,
		onClose: PropTypes.func,
		getPrimitives: PropTypes.func,
		getCollectionPaths: PropTypes.func
	};

	static defaultProps = {
		onSubmit: () => null,
		onClose: () => null
	};

	@observable obState = {
		isBusy: false
	};

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

	renderCollectionSettings(){
		const {formStore, editPath, getPrimitives} = this.props;
		const {isBusy} = this.obState;



		let collectionMainLabelOption = getPrimitives(editPath).map(primitive => ({
			label: primitive,
			value: primitive
		}));

		collectionMainLabelOption.unshift({label: '$key', value: ''});

		return (
			<Form store={formStore} onSubmit={this.handleSubmit}>
				<span/>

				<FormField compact name='collectionMainLabel' label='Main label key'>
					<SelectControl options={collectionMainLabelOption}/>
				</FormField>

				<FormField compact name='collectionImage' label='Image key'>
					<SelectControl options={collectionMainLabelOption}/>
				</FormField>

				<div className="OrkanSettingsPanel-actions">
					<SubmitButton primary disabled={!formStore.isDirty} isBusy={isBusy}>Save Changes</SubmitButton>
				</div>
			</Form>
		);
	}


	renderFieldSettings(){
		const {formStore, getPrimitives, getCollectionPaths} = this.props;
		const {isBusy} = this.obState;


		const collectionPathsOptions = getCollectionPaths().map(path => ({label: path, value: path}));
		let dataSourcePrimitivesOptions = [];

		if(formStore.get('dataSource') === 'dynamic'){
			dataSourcePrimitivesOptions = getPrimitives(formStore.get('dataSourcePath')).map(primitive => ({
				label: primitive,
				value: primitive
			}));

			dataSourcePrimitivesOptions.unshift({label: '$key', value: '$key'});
		}

		const isOptionsUiSelected = ['select', 'radio'].includes(formStore.get('uiType'));

		return (
			<Form store={formStore} onSubmit={this.handleSubmit}>
				<span/>

				<FormField compact name='uiType' label='UI type'>
					<SelectControl options={typeOptions}/>
				</FormField>

				{formStore.get('uiType') === 'textarea' &&
				<FormField compact name='uiSize' label='Size'>
					<SliderControl min={3} max={13} />
				</FormField>
				}

				{formStore.get('uiType') === 'slider' &&
				<FormField compact name='fromValue' label='From value'>
					<InputControl type='number' defaultValue={1} />
				</FormField>
				}

				{formStore.get('uiType') === 'slider' &&
				<FormField compact name='toValue' label='To value'>
					<InputControl type='number' defaultValue={10}  />
				</FormField>
				}


				{isOptionsUiSelected &&
				<FormField compact name='dataSource' label='Data Source'>
					<SelectControl options={dataSourceOptions}/>
				</FormField>
				}

				{isOptionsUiSelected && formStore.get('dataSource') === 'dynamic' &&
				<FormField compact name='dataSourcePath' label='Data Source Path'>
					<SelectControl options={collectionPathsOptions}/>
				</FormField>
				}

				{isOptionsUiSelected && formStore.get('dataSource') === 'dynamic' &&
				<FormField compact name='dataSourceLabel' label='Data Source Label'>
					<SelectControl options={dataSourcePrimitivesOptions}/>
				</FormField>
				}

				{isOptionsUiSelected && formStore.get('dataSource') === 'dynamic' &&
				<FormField compact name='dataSourceValue' label='Data Source Value'>
					<SelectControl options={dataSourcePrimitivesOptions}/>
				</FormField>
				}

				<div className="OrkanSettingsPanel-actions">
					<SubmitButton primary disabled={!formStore.isDirty} isBusy={isBusy}>Save Changes</SubmitButton>
				</div>
			</Form>
		);
	}

	render(){
		const {className, onClose, editPath, isCollectionPath} = this.props;

		const newClassName = classNames('OrkanSettingsPanel', className);

		return (
			<div className={newClassName}>
				<OrkanHeader title={['Settings', <span key={1}>{editPath}</span>]} onClose={onClose}/>
				{isCollectionPath
					?this.renderCollectionSettings()
					:this.renderFieldSettings()
				}
			</div>
		);
	}
}



const typeOptions = [
	{label: 'Checkbox', value: 'checkbox'},
	{label: 'Color Picker', value: 'color'},
	{label: 'Date Time', value: 'datetime'},
	{label: 'Media', value: 'media'},
	{label: 'Number', value: 'number'},
	{label: 'Switch', value: 'switch'},
	{label: 'Select', value: 'select'},
	{label: 'Slider', value: 'slider'},
	{label: 'Text', value: 'text'},
	{label: 'Textarea', value: 'textarea'},
];

const dataSourceOptions = [
	{label: 'Static', value: 'static'},
	{label: 'Dynamic', value: 'dynamic'}
];

