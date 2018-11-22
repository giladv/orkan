import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

import {formInput} from '../../form';
import Icon from '../../icon';
import {createStyle} from '../../utils/style-utils';

import style from './style';

@autobind
export default class Input extends Component {
	static propTypes = {
		value: PropTypes.string,
		type: PropTypes.oneOf(['text', 'number', 'password']),
		size: PropTypes.oneOf(['small', 'medium', 'large']),
		placeholder: PropTypes.string,
		defaultValue: PropTypes.any,
		preIcon: PropTypes.string,
		postIcon: PropTypes.string,
		onChange: PropTypes.func,
		disabled: PropTypes.bool,
		autoFocus: PropTypes.bool,
		error: PropTypes.bool
	};

	static defaultProps = {
		type: 'text',
		size: 'medium',
		onChange: () => null,
	};

	componentDidMount(){
		// we focus on next tick because otherwise transitions above it don't execute.
		this.props.autoFocus && setTimeout(() => this.refs.input.focus(), 100);
	}

	componentDidUpdate(){
		this.props.type !== 'number' && this.selection && this.refs.input.setSelectionRange(this.selection.start, this.selection.end);
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
		const {className, classes, preIcon, postIcon, value, onChange, placeholder, disabled, error, type, defaultValue, size, ...otherProps} = this.props;

		const s = createStyle(style, className, classes, style[size], {
			root: {
				hasPreIcon: !!preIcon,
				hasPostIcon: !!postIcon,
				error,
				disabled
			}
		});

		return (
			<div {...otherProps} className={s.root}>
				<input
					type={type}
					ref="input"
					defaultValue={defaultValue}
					disabled={disabled}
					className={s.input}
					placeholder={placeholder}
					onChange={this.handleChange}
					value={value || ''}/>

				{preIcon && <Icon className={s.preIcon} type={preIcon}/>}
				{postIcon && <Icon className={s.postIcon} type={preIcon}/>}
			</div>
		);
	}


}

export const InputControl = formInput()(Input);