import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {SketchPicker} from 'react-color';
import {observable} from 'mobx';
import {observer} from 'mobx-react';

import {formInput} from '../../form';

import './style';


function getContrastColor(hex = '', bw = true) {
	if (hex.indexOf('#') === 0) {
		hex = hex.slice(1);
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		// throw new Error('Invalid HEX color.');
		return;
	}
	var r = parseInt(hex.slice(0, 2), 16),
		g = parseInt(hex.slice(2, 4), 16),
		b = parseInt(hex.slice(4, 6), 16);
	if (bw) {
		// http://stackoverflow.com/a/3943023/112731
		return (r * 0.299 + g * 0.587 + b * 0.114) > 186
			? '#000000'
			: '#FFFFFF';
	}
	// invert color components
	r = (255 - r).toString(16);
	g = (255 - g).toString(16);
	b = (255 - b).toString(16);
	// pad each with zeros and return
	return "#" + padZero(r) + padZero(g) + padZero(b);
}


@observer
export default class ColorPicker extends Component {

	static propTypes = {
		value: PropTypes.bool,
		disabled: PropTypes.bool,
		onChange: PropTypes.func,
	};

	static defaultProps = {
		onChange: () => null,
	};

	@observable obState = {
		isOpen: false
	};

	render(){
		const {className, value, onChange, disabled, ...otherProps} = this.props;
		const {isOpen} = this.obState;

		const newClassName = classNames('ColorPicker', className, {
			'ColorPicker-disabled': disabled
		});

		return (
			<div {...otherProps} className={newClassName} onFocus={() => this.obState.isOpen = true} onBlur={() => this.obState.isOpen = false} tabIndex={0}>
				<div className="ColorPicker-color" style={{background: value, color: getContrastColor(value + '')}}>{value}</div>
				{isOpen && <SketchPicker color={value} onChange={e => onChange(e.hex)}/>}
			</div>
		);
	}
}

export const ColorPickerControl = formInput()(ColorPicker);
