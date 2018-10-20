import {observable, reaction, computed, action, toJS, isObservable, extendObservable} from 'mobx';
import forEach from 'lodash/forEach';
import find from 'lodash/find';

import {ObservableNestedMap} from './observable-nested-map';

export default class FormStore{

	@observable isDirty = false;
	errors = observable.map({});

	dataMap = new ObservableNestedMap({});
	validation = {};

	constructor(data = {}, validation = {}){
		this.dataMap.merge(data);
		this.validation = validation;
		// we use a delay of 1ms. otherwise reaction works syncronousely apparently.
		// this is bad because we can get false positives on the isDirty flag
		this.destroyReaction = reaction(() => this.data, () => {
			!this.ignoreChange && this.setDirty();
			this.ignoreChange = false;
			const fields = Array.from(this.errors.keys());

			this.clearAllErrors();
			this.validateFields(fields);
		}, {name: 'FormStore dirty check', fireImmediately: false, delay: 1});
	}

	@computed get data(){
		return this.toJS();
	}

	@computed get isValid(){
		return !find(this.validation, (validation, key) => !this.isFieldValid(key));
	}

	getFieldError(key){
		var value = this.get(key);
		var failedValidator = this.validation[key] && this.validation[key].find(validator => !validator.validate(value));
		return failedValidator && failedValidator.error;
	}

	isFieldValid(key){
		var value = this.get(key);
		var failedValidator = this.validation[key] && this.validation[key].find(validator => !validator.validate(value));
		return !failedValidator;
	}

	validateFields(fields = []){
		fields.forEach(field => {
			this.errors.set(field, this.getFieldError(field));
		});
	}

	clearFieldErrors(fields = []){
		forEach(fields, field => {
			this.errors.delete(field);
		});
	}

	clearAllErrors(){
		this.errors.clear();
	}

	@action set(key, value, ignoreChange = false){
		this.ignoreChange = ignoreChange;
		return this.dataMap.set(key, value);
	}

	get(key){
		var value = this.dataMap.get(key);
		return isObservable(value)?toJS(value):value;
	}

	@action setDirty(){
		this.isDirty = true;
	}

	@action setClean(){
		this.isDirty = false;
	}


	reset(value){
		this.ignoreChange = true;
		this.dataMap.clear();
		this.setClean();
		value && this.dataMap.merge(value);
	}

	destroy(){
		this.destroyReaction();
	}

	toJS(){
		return this.dataMap.toJS();
	}
}


export class FormValidators{

	static required({error = 'This field is required'} = {}){
		return {
			validate: value => !!value,
			error
		};
	}

    static notEmpty({error = 'This field is required'} = {}){
        return {
            validate: value => !!value && !!value.trim(),
            error
        };
    }

	static emailValidation({error = 'Please enter a valid email address'} = {}){
		var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return {
			validate: value => {return emailRegex.test(value)},
			error
		};
	}

	static passwordValidation({error = 'Your password must have at least 6 characters'} = {}){
		var passwordRegex = /^\S{6,}$/;
		return {
			validate: value => {return passwordRegex.test(value)},
			error
		};
	}


	static editorRequired({error = 'This field is required'} = {}){
		return {
			validate: value => value && value.getCurrentContent().hasText(),
			error
		};
	}

    static maxLength({maxLength, error = 'Text too long'} = {}){
        return {
            validate: value => !value || value.length <= maxLength,
            error
        };
    }

    static urlValidation({error = 'Url is not valid'} = {}){
		var urlRegex=/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
		return {
			validate: value => {return urlRegex.test(value)},
			error
		}
	}

	static allTagsMaxLength({limit=25, error = `Tag cannot exceed ${limit} characters`} = {}){
		var validator = (value) => {
			var tagsStrArray = value.split(",");
			var result = false;
			tagsStrArray.forEach((tagStr) => {
				tagStr = tagStr.trim();
				if (tagStr.length < limit) {
					result = true;
				}
			});
			return result;
		};

		return {
			validate: validator,
			error
		}
	}
}