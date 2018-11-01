import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import Icon from '../../icon';

import {formInput} from '../../form';
import {createStyle} from '../../utils/style-utils';

import style from './style';


@autobind
export default class Checkbox extends Component {

	static propTypes = {
		icon: PropTypes.string,
		value: PropTypes.bool,
		disabled: PropTypes.bool,
		onChange: PropTypes.func,
	};

	static defaultProps = {
		onChange: () => null,
		icon: 'v'
	};

	toggle(){
		const {onChange, value, disabled} = this.props;
		!disabled && onChange(!value);
	}

	render(){
		const {classes, className, value, icon, disabled, ...otherProps} = this.props;

		const s = createStyle(style, className, classes, {
			root: {
				checked: !!value,
				disabled
			}
		});

		return (
			<a {...otherProps} className={s.root} onClick={this.toggle}>
				<span>
					<Icon className={s.icon} type={icon}/>
				</span>
			</a>
		);
	}
}

export const CheckboxControl = formInput()(Checkbox);
