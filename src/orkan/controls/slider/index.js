import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import OriginalSlider from 'rc-slider';

import {formInput} from '../../form';
import {createStyle} from '../../utils/style-utils';

import 'rc-slider/assets/index.css';
import style from './style';

@autobind
export default class Slider extends Component {
	static propTypes = {
		...OriginalSlider.propTypes
	};

	static defaultProps = {
	};


	render(){
		const {className, error, value, min, ...otherProps} = this.props;

		const s = createStyle(style, className, {
			root: {
				error
			}
		});

		const safeValue = isNaN(value)?0:value;

		return <OriginalSlider {...otherProps} className={s.root} value={safeValue} min={parseFloat(min)}/>;
	}


}

export const SliderControl = formInput()(Slider);