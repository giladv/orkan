import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import OriginalSwitch from "react-switch";

import {formInput} from '../../form';

import './style';

@observer
export default class Switch extends Component {

	static propTypes = {
		value: PropTypes.bool,
		disabled: PropTypes.bool,
		onChange: PropTypes.func,
	};

	static defaultProps = {
		onChange: () => null,
	};

	render(){
		const {className, value, onChange, disabled, ...otherProps} = this.props;

		const newClassName = classNames('Switch', className, {
			'Switch-disabled': disabled
		});

		return (
			<OriginalSwitch
				{...otherProps}
				className={newClassName}
				// onColor='#48e4c6'
				// offColor='#cdd3df'
				offHandleColor='#cdd3df'
				onHandleColor='#fa2849'
				handleDiameter={16}
				uncheckedIcon={false}
				checkedIcon={false}
				onChange={onChange}
				checked={value}/>
		);
	}
}

export const SwitchControl = formInput()(Switch);
