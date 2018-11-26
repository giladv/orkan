import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import Spinner from '../spinner';

import style from './style';
import {formSubmit} from '../form';
import {createStyle} from '../utils/style-utils';

@observer
export default class Button extends Component{
	static propTypes = {
		primary: PropTypes.bool,
		important: PropTypes.bool,
		secondary: PropTypes.bool,
		square: PropTypes.bool,
		isBusy: PropTypes.bool,
		disabled: PropTypes.bool,
		size: PropTypes.oneOf(['small', 'medium', 'large'])
	};

	static defaultProps = {
		size: 'medium'
	};


	render(){
		const {className, classes, primary, secondary, important, square, isBusy, disabled, size, onClick, ...otherProps} = this.props;

		const s = createStyle(style, className, classes, style[size], {
			root: {
				primary,
				secondary,
				important,
				disabled,
				square,
				busy: isBusy
			}
		});

		return (
			<a {...otherProps} className={s.root} tabIndex="0" onClick={e => !disabled && onClick(e)}>
				<Spinner className={s.spinner} size={2}/>
				<div className={s.label}>{this.props.children}</div>
			</a>
		);
	}
}

export const SubmitButton = formSubmit(Button);
