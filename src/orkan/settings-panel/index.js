import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import autobind from 'autobind-decorator';
import {SwitchControl} from '../controls/switch';

import Form from '../form';
import FormField from '../form-field';
import {SubmitButton} from '../button';
import {SelectControl} from '../controls/select';
import {InputControl} from '../controls/input';
import Header from '../header';
import {SliderControl} from '../controls/slider';
import OrkanStore2 from '../orkan-store2';
import {toAbsolutePath} from '../utils/path-utils';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';


@observer
export default class SettingsPanel extends Component{

	static propTypes = {
		store: PropTypes.instanceOf(OrkanStore2).isRequired,
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

	getStyle(){
		const {className, classes} = this.props;
		return createStyle(style, className, classes);
	}

	@computed get isOptionsUiSelected(){
		const {store} = this.props;
		return ['select', 'radio'].includes(store.settingsFormStore.get('uiType'));
	}

	@computed get dataSourcePrimitivesOptions(){
		const {store} = this.props;

		const dataSourcePath = store.settingsFormStore.get('dataSourcePath');
		const isDynamicSourceSelected = store.settingsFormStore.get('dataSource') === 'dynamic';
		const isCollectionOfPrimitives = !store.isPathPrimitive(toAbsolutePath(dataSourcePath + '/0'));

		if(this.isOptionsUiSelected && isDynamicSourceSelected && dataSourcePath && isCollectionOfPrimitives){
			const dataSourcePrimitivesOptions = store.getPrimitiveKeysByPath(dataSourcePath + '/0').map(primitive => ({
				label: primitive,
				value: primitive
			}));

			dataSourcePrimitivesOptions.unshift({label: '$key', value: '$key'});
			dataSourcePrimitivesOptions.unshift({label: '$value', value: '$value'});

			return dataSourcePrimitivesOptions;
		}

		return [];
	}

	renderCollectionSettings(){
		const {store} = this.props;
		const {isBusy} = this.obState;

		const iterableFieldsOptions = store.getPrimitiveKeysByPath(store.settingsPath + '/0').map(primitive => ({
			label: primitive,
			value: primitive
		}));

		const labelFieldOptions = [{label: '$key (default)', value: null}, ...iterableFieldsOptions];
		const imageFieldOptions = [{label: 'none (default)', value: null}, ...iterableFieldsOptions];

		const s = this.getStyle();

		return (
			<Form className={s.form} store={store.settingsFormStore} onSubmit={this.handleSubmit}>
				<span/>

				<FormField className={s.formField} name='labelField' label='Label field'>
					<SelectControl options={labelFieldOptions} defaultValue={labelFieldOptions[0].value}/>
				</FormField>

				<FormField className={s.formField} name='imageField' label='Image field'>
					<SelectControl options={imageFieldOptions} defaultValue={imageFieldOptions[0].value}/>
				</FormField>

				<div className={s.actions}>
					<SubmitButton primary disabled={!store.settingsFormStore.isDirty} isBusy={isBusy}>Save Changes</SubmitButton>
				</div>
			</Form>
		);
	}


	renderFieldSettings(){
		const {store} = this.props;
		const {isBusy} = this.obState;

		const s = this.getStyle();

		const collectionPathsOptions = store.getIterableSchemaPaths().map(path => ({label: path, value: path}));

		const isOptionsUiSelected = ['select', 'radio'].includes(store.settingsFormStore.get('uiType'));



		return (
			<Form className={s.form} store={store.settingsFormStore} onSubmit={this.handleSubmit}>
				<span/>

				<FormField className={s.formField} name='uiType' label='UI type'>
					<SelectControl options={typeOptions}/>
				</FormField>

				{['textarea', 'wysiwyg'].includes(store.settingsFormStore.get('uiType')) &&
					<FormField className={s.formField} name='uiSize' label='Size'>
						<SliderControl min={3} max={30} />
					</FormField>
				}

				{store.settingsFormStore.get('uiType') === 'textarea' &&
					<FormField className={s.formField} name='isCodeFriendly' label='Code friendly'>
						<SwitchControl />
					</FormField>
				}

				{store.settingsFormStore.get('uiType') === 'slider' &&
					<FormField className={s.formField} name='fromValue' label='From value'>
						<InputControl type='number' defaultValue={1} />
					</FormField>
				}

				{store.settingsFormStore.get('uiType') === 'slider' &&
					<FormField className={s.formField} name='toValue' label='To value'>
						<InputControl type='number' defaultValue={10}  />
					</FormField>
				}


				{isOptionsUiSelected &&
					<FormField className={s.formField} name='dataSource' label='Data Source'>
						<SelectControl options={dataSourceOptions} defaultValue={dataSourceOptions[0].value}/>
					</FormField>
				}

				{isOptionsUiSelected && store.settingsFormStore.get('dataSource') === 'dynamic' &&
					<FormField className={s.formField} name='dataSourcePath' label='Iterable Path'>
						<SelectControl options={collectionPathsOptions}/>
					</FormField>
				}

				{isOptionsUiSelected && store.settingsFormStore.get('dataSource') === 'dynamic' &&
					<FormField className={s.formField} name='dataSourceLabel' label='Label'>
						<SelectControl options={this.dataSourcePrimitivesOptions} defaultValue={this.dataSourcePrimitivesOptions.length && this.dataSourcePrimitivesOptions[1].value}/>
					</FormField>
				}

				{isOptionsUiSelected && store.settingsFormStore.get('dataSource') === 'dynamic' &&
					<FormField className={s.formField} name='dataSourceValue' label='Value'>
						<SelectControl options={this.dataSourcePrimitivesOptions} defaultValue={this.dataSourcePrimitivesOptions.length && this.dataSourcePrimitivesOptions[1].value}/>
					</FormField>
				}

				<div className={s.actions}>
					<SubmitButton primary disabled={!store.settingsFormStore.isDirty} isBusy={isBusy}>Save Changes</SubmitButton>
				</div>
			</Form>
		);
	}

	render(){
		const {store} = this.props;

		const s = this.getStyle();

		return (
			<div className={s.root}>
				<Header title={['Settings', <span key={1} className={s.headerPath}>{store.settingsPath}</span>]} onActionClick={() => store.clearSettingsPath()}/>
				{(store.isPathCollection(store.settingsPath) || store.isPathArray(store.settingsPath))
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

