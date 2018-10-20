import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import {formInput} from '../../form';
import {
	UI_DEFAULT_THEME, UI_LARGE, UI_MEDIUM, UI_NEGATIVE_THEME, UI_SIZES, UI_SMALL,
	UI_THEMES
} from '../../../constants/general-constants';

import './style';

@autobind
export default class Radio extends Component {

	static propTypes = {
		value: PropTypes.any,
		options: PropTypes.array,
		onChange: PropTypes.func,
		theme: PropTypes.oneOf(UI_THEMES),
		size: PropTypes.oneOf(UI_SIZES),
		error: PropTypes.bool
	};


	static defaultProps = {
		onChange: () => null,
		options: [],
		size: UI_MEDIUM,
		theme: UI_DEFAULT_THEME
	};


	handleChange(e){
		const {onChange} = this.props;
		onChange(e.target.value);
		e.stopPropagation();
	}

	render(){
		const {className, value, size, theme, options, name, ...otherProps} = this.props;

		const newClassName = classNames('Radio', className, {
			'Radio-small': size === UI_SMALL,
			'Radio-medium': size === UI_MEDIUM,
			'Radio-large': size === UI_LARGE,
			'Radio-negative': theme === UI_NEGATIVE_THEME
		});

		return (
			<div className={newClassName}>
				{options.map((option, i) =>{
					return (
						<label key={i}>
							<input
								type="radio"
								onChange={this.handleChange}
								value={option.value}
								checked={value === option.value}
								name={name}/>
							{option.label}
						</label>
					);
				})}
			</div>
		);
	}

}


export const RadioControl = formInput()(Radio);