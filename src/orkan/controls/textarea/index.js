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
		codeFriendly: PropTypes.bool,
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

	handleKeyDown(e) {
		const {onChange, value} = this.props;

		if (e.key === 'Tab'){
			let newValue;
			const start = e.target.selectionStart;
			const end = e.target.selectionEnd;

			if(e.shiftKey){
				const prevChar = value.substr(start - 1, 1);
				if(prevChar === '\t') {
					newValue = value.substr(0, start - 1) + value.substr(start, value.length - start);
					this.selection = {
						start: start - 1,
						end: end - 1
					};
				}
			}else{
				newValue = value.substring(0, start) + '\t' + value.substring(end);
				this.selection = {
					start: start + 1,
					end: end + 1
				};
			}

			newValue && onChange(newValue);
			e.preventDefault();
		}
	}



	render(){

		const {className, value, rows, onChange, placeholder, disabled, size, codeFriendly, ...otherProps} = this.props;

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
					onKeyDown={codeFriendly && this.handleKeyDown}
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