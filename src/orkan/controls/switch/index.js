import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import OriginalSwitch from "react-switch";

import {formInput} from '../../form';
import {createStyle} from '../../utils/style-utils';

import style from './style';

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

		const s = createStyle(style, className, {
			root: {
				disabled
			}
		});

		return (
			<OriginalSwitch
				{...otherProps}
				className={s.root}
				offHandleColor='#cdd3df'
				onHandleColor='#fa2849'
				handleDiameter={12}
				height={22}
				width={40}
				uncheckedIcon={false}
				checkedIcon={false}
				onChange={onChange}
				checked={value}/>
		);
	}
}

export const SwitchControl = formInput()(Switch);
