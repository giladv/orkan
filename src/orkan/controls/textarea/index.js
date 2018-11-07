import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import tabOverride from 'taboverride';

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
		const {selectionStart, selectionEnd} = e.target;
		this.selection = {
			selectionStart,
			selectionEnd
		};

		this.props.onChange(e.target.value);

		e.stopPropagation();
	}

	componentDidMount(){
		this.props.codeFriendly && this.initCodeFriendly();
	}

	componentDidUpdate(){
		// re selecting latest selection
		this.selection && this.input.setSelectionRange(this.selection.selectionStart, this.selection.selectionEnd);
	}

	componentWillReceiveProps(nextProps){
		const {codeFriendly} = this.props;

		if(codeFriendly !== nextProps.codeFriendly){
			nextProps.codeFriendly?this.initCodeFriendly():this.destroyCodeFriendly();
		}
	}

	componentWillUnmount(){
		this.destroyCodeFriendly();
	}

	handleKeyDown(e) {
		const {onChange, codeFriendly} = this.props;
		if(!codeFriendly){
			return;
		}

		const {selectionStart, selectionEnd} = e.target;

		this.selection = {
			selectionStart,
			selectionEnd
		};

		onChange(e.target.value);
	}

	initCodeFriendly(){
		tabOverride.set(this.input);

	}

	destroyCodeFriendly(){
		tabOverride.set(this.input, false);

	}



	render(){

		const {className, value, rows, onChange, placeholder, disabled, size, codeFriendly, ...otherProps} = this.props;

		const s = createStyle(style, className, style[size], {
			root: {
				disabled,
				codeFriendly
			}
		});

		return (
			<div {...otherProps} className={s.root}>
				<textarea
					ref={ref => this.input = ref}
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