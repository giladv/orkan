import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import Icon from '../../orkan-icon';

import {formInput} from '../../form';

import './style';


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
		const {className, value, icon, disabled, ...otherProps} = this.props;

		const newClassName = classNames('Checkbox', className, {
			'Checkbox-checked': value,
			'Checkbox-disabled': disabled
		});

		return (
			<a {...otherProps} className={newClassName} onClick={this.toggle}>
				<span>
					<Icon type={icon}/>
				</span>
			</a>
		);
	}
}

export const CheckboxControl = formInput()(Checkbox);
