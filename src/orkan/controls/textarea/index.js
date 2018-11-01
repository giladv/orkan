import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

import {formInput} from '../../form';
import {createStyle} from '../../utils/style-utils';

import style from './style';

@autobind
export default class Textarea extends Component {

	static propTypes = {
		value: PropTypes.string,
		rows: PropTypes.number,
		size: PropTypes.oneOf(['small', 'medium', 'large']),
		placeholder: PropTypes.string,
		onChange: PropTypes.func,
		disabled: PropTypes.bool,
	};

	static defaultProps = {
		size: 'medium',
		onChange: () => null
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

		const {className, value, rows, onChange, placeholder, disabled, size, ...otherProps} = this.props;

		const s = createStyle(style, className, style[size], {
			root: {
				disabled
			}
		});

		return (
			<div {...otherProps} className={s.root}>
				<textarea
					ref="input"
					rows={rows}
					disabled={disabled}
					className={s.input}
					placeholder={placeholder}
					onChange={this.handleChange}
					value={value}/>
			</div>
		);
	}
}


export const TextareaControl = formInput()(Textarea);