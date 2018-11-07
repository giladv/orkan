import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import {SwitchControl} from '../controls/switch';

import Form from '../form';
import FormField from '../form-field';
import {SubmitButton} from '../button';
import {SelectControl} from '../controls/select';
import {InputControl} from '../controls/input';
import Header from '../header';
import {SliderControl} from '../controls/slider';
import OrkanStore from '../orkan-store';
import {COLLECTION_KEY} from '../constants';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';


@observer
export default class SettingsPanel extends Component{

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

	getStyle(){
		const {className, classes} = this.props;
		return createStyle(style, className, classes);
	}

	renderCollectionSettings(){
		const {store} = this.props;
		const {isBusy} = this.obState;

		let collectionMainLabelOption = store.getPrimitiveKeysByPath(store.settingsPath + '/' + COLLECTION_KEY).map(primitive => ({
			label: primitive,
			value: primitive
		}));

		collectionMainLabelOption.unshift({label: '$key', value: ''});

		const s = this.getStyle();

		return (
			<Form className={s.form} store={store.settingsFormStore} onSubmit={this.handleSubmit}>
				<span/>

				<FormField className={s.formField} name='collectionMainLabel' label='Main label key'>
					<SelectControl options={collectionMainLabelOption}/>
				</FormField>

				<FormField className={s.formField} name='collectionImage' label='Image key'>
					<SelectControl options={collectionMainLabelOption}/>
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

		const collectionPathsOptions = store.getCollectionsPaths().map(path => ({label: path, value: path}));
		let dataSourcePrimitivesOptions = [];

		if(store.settingsFormStore.get('dataSource') === 'dynamic' && store.settingsFormStore.get('dataSourcePath')){
			dataSourcePrimitivesOptions = store.getPrimitiveKeysByPath(store.settingsFormStore.get('dataSourcePath') + '/' + COLLECTION_KEY).map(primitive => ({
				label: primitive,
				value: primitive
			}));

			dataSourcePrimitivesOptions.unshift({label: '$key', value: '$key'});
		}

		const isOptionsUiSelected = ['select', 'radio'].includes(store.settingsFormStore.get('uiType'));

		return (
			<Form className={s.form} store={store.settingsFormStore} onSubmit={this.handleSubmit}>
				<span/>

				<FormField className={s.formField} name='uiType' label='UI type'>
					<SelectControl options={typeOptions}/>
				</FormField>

				{['textarea', 'wysiwyg'].includes(store.settingsFormStore.get('uiType')) &&
					<FormField className={s.formField} name='uiSize' label='Size'>
						<SliderControl min={3} max={13} />
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
					<SelectControl options={dataSourceOptions}/>
				</FormField>
				}

				{isOptionsUiSelected && store.settingsFormStore.get('dataSource') === 'dynamic' &&
				<FormField className={s.formField} name='dataSourcePath' label='Data Source Path'>
					<SelectControl options={collectionPathsOptions}/>
				</FormField>
				}

				{isOptionsUiSelected && store.settingsFormStore.get('dataSource') === 'dynamic' &&
				<FormField className={s.formField} name='dataSourceLabel' label='Data Source Label'>
					<SelectControl options={dataSourcePrimitivesOptions}/>
				</FormField>
				}

				{isOptionsUiSelected && store.settingsFormStore.get('dataSource') === 'dynamic' &&
				<FormField className={s.formField} name='dataSourceValue' label='Data Source Value'>
					<SelectControl options={dataSourcePrimitivesOptions}/>
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
				<Header title={['Settings', <span key={1} className={s.headerPath}>{store.settingsPath}</span>]} onClose={() => store.clearSettingsPath()}/>
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

