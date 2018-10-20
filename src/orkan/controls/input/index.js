import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import {formInput} from '../../form';

import Icon from '../../orkan-icon';

import './style';

@autobind
export default class Input extends Component {
	static PropTypes = {
		value: PropTypes.string,
		placeholder: PropTypes.string,
		preIcon: PropTypes.string,
		postIcon: PropTypes.string,
		onChange: PropTypes.func,
		disabled: PropTypes.bool,
		important: PropTypes.bool,
		autoFocus: PropTypes.bool,
		error: PropTypes.bool
	};

	static defaultProps = {
		onChange: () => null,
	};

	componentDidMount(){
		// we focus on next tick because otherwise transitions above it don't execute.
		this.props.autoFocus && setTimeout(() => this.refs.input.focus(), 100);
	}

	componentDidUpdate(){
		this.selection && this.refs.input.setSelectionRange(this.selection.start, this.selection.end);
	}

	handleChange(e){

		this.selection = {
			start: e.target.selectionStart,
			end: e.target.selectionEnd
		};

		this.props.onChange(e.target.value);

		e.stopPropagation();
	}

	render(){
		const {className, preIcon, postIcon, value, onChange, placeholder, disabled, error, important, ...otherProps} = this.props;

		const inputClassName = classNames('Input-input', {
			'Input-input-pre-padding': !!preIcon,
			'Input-input-post-padding': !!postIcon,
		});

		const newClassName = classNames('Input', className, {
			'Input-medium': true,
			'Input-error': error,
			'Input-important': important
		});

		return (
			<div {...otherProps} className={newClassName}>
				<input
					type="text"
					ref="input"
					disabled={disabled}
					className={inputClassName}
					placeholder={placeholder}
					onChange={this.handleChange}
					value={value || ''}
					onKeyDown={this.handleKeyDown}/>

				{preIcon && <Icon className='Input-pre-icon' type={preIcon}/>}
				{postIcon && <Icon className='Input-post-icon' type={preIcon}/>}
			</div>
		);
	}


}

export const InputControl = formInput()(Input);