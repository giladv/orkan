import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import {formInput} from '../../form';

import './style';

@autobind
export default class Textarea extends Component {

	static PropTypes = {
		value: PropTypes.string,
		rows: PropTypes.number,
		placeholder: PropTypes.string,
		onChange: PropTypes.func,
		disabled: PropTypes.bool,
		negative: PropTypes.bool
	};

	handleChange(e){

		this.selection = {
			start: e.target.selectionStart,
			end: e.target.selectionEnd
		};

		this.props.onChange(e.target.value);

		e.stopPropagation();

	}

	componentDidUpdate(){
		this.selection && this.refs.input.setSelectionRange(this.selection.start, this.selection.end);
	}

	render(){

		var {className, value, rows, onChange, placeholder, small, disabled, negative} = this.props;

		var inputClassName = classNames('Textarea-input', {});

		var className = classNames('Textarea', className, {
			'Textarea-medium': true,
			'Textarea-negative': negative
		})

		return (
			<div className={className}>

				<textarea
					ref="input"
					rows={rows}
					disabled={disabled}
					className={inputClassName}
					placeholder={placeholder}
					onChange={this.handleChange}
					value={value}></textarea>
			</div>
		);
	}
}


export const TextareaControl = formInput()(Textarea);