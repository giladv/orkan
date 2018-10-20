import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import OriginalSlider from 'rc-slider';

import {formInput} from '../../form';

import 'rc-slider/assets/index.css';
import './style';

@autobind
export default class Slider extends Component {
	static PropTypes = {
		...OriginalSlider.propTypes
	};

	static defaultProps = {
	};


	render(){
		const {className, error, ...otherProps} = this.props;

		const newClassName = classNames('Slider', className, {
			'Slider-error': error,
		});

		return <OriginalSlider {...otherProps} className={newClassName}/>;
	}


}

export const SliderControl = formInput()(Slider);