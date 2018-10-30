import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import Form, {FormField} from '../form/index';
import {SubmitButton} from '../button';
import {SelectControl} from '../controls/select';
import {InputControl} from '../controls/input';
import OrkanHeader from '../orkan-header';
import {SliderControl} from '../controls/slider';
import OrkanStore from '../orkan-store';
import {COLLECTION_KEY} from '../constants';

import './style.scss';


@observer
export default class OrkanSettingsPanel extends Component{

	static propTypes = {
		store: PropTypes.instanceOf(OrkanStore).isRequired,
	};

	static defaultProps = {
	};

	@observable obState = {
		isBusy: false
	};

	@autobind
	async handleSubmit(){
		const {store} = this.props;

		this.obState.isBusy = true;
		await store.submitSettings();
		this.obState.isBusy = false;
	}

	renderCollectionSettings(){
		const {store} = this.props;
		const {isBusy} = this.obState;

		let collectionMainLabelOption = store.getPrimitiveKeysByPath(store.settingsPath + '/' + COLLECTION_KEY).map(primitive => ({
			label: primitive,
			value: primitive
		}));

		collectionMainLabelOption.unshift({label: '$key', value: ''});

		return (
			<Form store={store.settingsFormStore} onSubmit={this.handleSubmit}>
				<span/>

				<FormField compact name='collectionMainLabel' label='Main label key'>
					<SelectControl options={collectionMainLabelOption}/>
				</FormField>

				<FormField compact name='collectionImage' label='Image key'>
					<SelectControl options={collectionMainLabelOption}/>
				</FormField>

				<div className="OrkanSettingsPanel-actions">
					<SubmitButton primary disabled={!store.settingsFormStore.isDirty} isBusy={isBusy}>Save Changes</SubmitButton>
				</div>
			</Form>
		);
	}


	renderFieldSettings(){
		const {store} = this.props;
		const {isBusy} = this.obState;


		const collectionPathsOptions = store.getCollectionsPaths().map(path => ({label: path, value: path}));
		let dataSourcePrimitivesOptions = [];

		if(store.settingsFormStore.get('dataSource') === 'dynamic'){
			dataSourcePrimitivesOptions = store.getPrimitiveKeysByPath(store.settingsFormStore.get('dataSourcePath') + '/' + COLLECTION_KEY).map(primitive => ({
				label: primitive,
				value: primitive
			}));

			dataSourcePrimitivesOptions.unshift({label: '$key', value: '$key'});
		}

		const isOptionsUiSelected = ['select', 'radio'].includes(store.settingsFormStore.get('uiType'));

		return (
			<Form store={store.settingsFormStore} onSubmit={this.handleSubmit}>
				<span/>

				<FormField compact name='uiType' label='UI type'>
					<SelectControl options={typeOptions}/>
				</FormField>

				{['textarea', 'wysiwyg'].includes(store.settingsFormStore.get('uiType')) &&
					<FormField compact name='uiSize' label='Size'>
						<SliderControl min={3} max={13} />
					</FormField>
				}

				{store.settingsFormStore.get('uiType') === 'slider' &&
					<FormField compact name='fromValue' label='From value'>
						<InputControl type='number' defaultValue={1} />
					</FormField>
				}

				{store.settingsFormStore.get('uiType') === 'slider' &&
					<FormField compact name='toValue' label='To value'>
						<InputControl type='number' defaultValue={10}  />
					</FormField>
				}


				{isOptionsUiSelected &&
				<FormField compact name='dataSource' label='Data Source'>
					<SelectControl options={dataSourceOptions}/>
				</FormField>
				}

				{isOptionsUiSelected && store.settingsFormStore.get('dataSource') === 'dynamic' &&
				<FormField compact name='dataSourcePath' label='Data Source Path'>
					<SelectControl options={collectionPathsOptions}/>
				</FormField>
				}

				{isOptionsUiSelected && store.settingsFormStore.get('dataSource') === 'dynamic' &&
				<FormField compact name='dataSourceLabel' label='Data Source Label'>
					<SelectControl options={dataSourcePrimitivesOptions}/>
				</FormField>
				}

				{isOptionsUiSelected && store.settingsFormStore.get('dataSource') === 'dynamic' &&
				<FormField compact name='dataSourceValue' label='Data Source Value'>
					<SelectControl options={dataSourcePrimitivesOptions}/>
				</FormField>
				}

				<div className="OrkanSettingsPanel-actions">
					<SubmitButton primary disabled={!store.settingsFormStore.isDirty} isBusy={isBusy}>Save Changes</SubmitButton>
				</div>
			</Form>
		);
	}

	render(){
		const {className, store} = this.props;

		const newClassName = classNames('OrkanSettingsPanel', className);

		return (
			<div className={newClassName}>
				<OrkanHeader title={['Settings', <span key={1}>{store.settingsPath}</span>]} onClose={() => store.clearSettingsPath()}/>
				{store.isPathCollection(store.settingsPath)
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
	{label: 'WYSIWYG', value: 'wysiwyg'},
];

const dataSourceOptions = [
	{label: 'Static', value: 'static'},
	{label: 'Dynamic', value: 'dynamic'}
];

