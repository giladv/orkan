import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import {InputControl} from '../controls/input';

import Form from '../form';
import FormField from '../form-field';
import {SubmitButton} from '../button';
import FormStore, {FormValidators} from '../form/form-store';
import Header from '../header';
import {getParentPath, stripRootFromPath, toAbsolutePath} from '../utils/path-utils';

import {createStyle} from '../utils/style-utils';

import style from './style.scss';


const validCollectionPath = (store, targetPath, error = 'path schema is not compatible') => ({
	validate: collectionPath => {
		if(!collectionPath){
			return false;
		}

		const absoluteCollectionPath = toAbsolutePath(collectionPath);
		const collectionPathSchema = store.getSchemaByPath(absoluteCollectionPath);
		return collectionPathSchema && store.isSchemaCompatible(store.toSchemaPath(getParentPath(targetPath)), absoluteCollectionPath);
	},
	error
});

@observer
export default class MoveModal extends Component{

	static propTypes = {
	};

	static defaultProps = {
	};

	@observable obState = {
		isBusy: false
	};

	formStore = new FormStore({}, {
		collectionPath: [FormValidators.required(), validCollectionPath(this.props.store, this.props.path)]
	});

	componentWillMount(){

	}

	@autobind
	async handleSubmit(){
		const {store, path, resolve} = this.props;

		this.obState.isBusy = true;
		const targetValue = store.getValue(path);
		const collectionPath = this.formStore.get('collectionPath');
		const key = this.formStore.get('key');
		await store.dataStore.setValue(stripRootFromPath(collectionPath) + '/' + (key || store.dataStore.push(collectionPath).key), targetValue);
		await store.dataStore.remove(stripRootFromPath(path));
		this.obState.isBusy = false;
		resolve();
	}

	render(){
		const {store, className, classes, path} = this.props;
		const {isBusy} = this.obState;

		const s = createStyle(style, className, classes);

		return (
			<div className={s.root}>
				<Header className={s.header} title='Move to collection'/>
				<Form className={s.form} store={this.formStore} onSubmit={this.handleSubmit}>
					<FormField compact className={s.formField} label='Target collection' name='collectionPath'>
						<InputControl placeholder='blog/posts'/>
					</FormField>
					<FormField compact className={s.formField} label='New key (optional)' name='key'>
						<InputControl/>
					</FormField>
					<div className={s.actions}>
						<SubmitButton primary disabled={this.formStore.isDirty} isBusy={isBusy}>Save Changes</SubmitButton>
					</div>
				</Form>
			</div>
		);
	}
}