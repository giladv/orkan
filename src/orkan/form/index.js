import React, {Component, cloneElement} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable, action} from 'mobx';
import autobind from 'autobind-decorator';

import FormStore from './form-store';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';


@observer
export default class Form extends Component {
	static propTypes = {
		store: PropTypes.instanceOf(FormStore).isRequired,
		onSubmit: PropTypes.func
	};

	static childContextTypes = {
		form: PropTypes.object
	};

	static contextTypes = {
		form: PropTypes.object
	};

	@observable state = {
		activeFields: []
	};

	registerField(name){
		let {activeFields} = this.state;
		if(activeFields.indexOf(name) < 0){
			this.state.activeFields.push(name);
		}
	}

	deregisterField(name){
		this.state.activeFields.remove(name);
	}

	isValid(){
		var {store} = this.props;
		return !this.state.activeFields.find(field => !store.isFieldValid(field));
	}

	getChildContext(){
		return {form: this};
	}

	get(key){
		var {store} = this.props;
		return store.get(key);
	}

	set(key, value, ignoreChange){
		var {store} = this.props;
		return store.set(key, value, ignoreChange);
	}

	getError(key){
		const {store} = this.props;
		return store.errors.get(key) || null;
	}

	@action
	submit(){
		const {onSubmit, store} = this.props;

		store.clearAllErrors();
		store.validateFields(this.state.activeFields);
		this.isValid() && onSubmit(store.data);
	}

	@autobind
	handleSubmit(e){
		this.submit();
		e.preventDefault();
		e.stopPropagation();
	}

	render(){
		const {className, children} = this.props;
		const s = createStyle(style, className);

		return (
			<form className={s.root} action='/' onSubmit={this.handleSubmit}>
				{children}
				{/*this to allow submit on return*/}
				<input type="submit" style={{display: 'none'}}/>
			</form>
		);
	}
}


export function formInput(mapProps){

	return DecoratedComponent => {
		class FormInput extends Component {
			static propTypes = {
				name: PropTypes.string,
				onChange: PropTypes.func
			};

			static defaultProps = {
				onChange: () => null
			};

			static contextTypes = {
				form: PropTypes.object
			};

			componentWillMount(){
				const {form} = this.context;
				const {name} = this.props;
				name && form.registerField(name);
			}

			componentWillUnmount(){
				const {form} = this.context;
				const {name} = this.props;
				name && form.deregisterField(name);
			}


			mapProps({value, onChange, error}){
				return {value, onChange, error: error};
			}

			@autobind
			onChange(value, ignoreChange = false){
				const {form} = this.context;
				const {name} = this.props;

				form.set(name, value, ignoreChange);
				this.props.onChange(value);
			}

			render(){
				const {form} = this.context;
				const {name} = this.props;
				let mappedProps;

				if(name){
					const value = form.get(name);
					const error = form.getError(name);
					mappedProps = (mapProps || this.mapProps)({value, onChange: this.onChange, error});
				}else{
					mappedProps = {};
				}

				return <DecoratedComponent {...this.props} {...mappedProps} />;
			}
		}

		return observer(FormInput);
	}
}

export const formSubmit = DecoratedComponent =>
	class FormSubmit extends Component {
		static contextTypes = {
			form: PropTypes.object
		};

		render(){
			const {className} = this.props;
			const {form} = this.context;

			return <DecoratedComponent {...this.props} onClick={e => form.submit()}/>;
		}
	};