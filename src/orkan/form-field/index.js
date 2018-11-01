import React, {Component, cloneElement} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator';

import {createStyle} from '../utils/style-utils';
import {formInput} from '../form';

import style from  './style.scss';


@formInput()
export default class FormField extends Component {

	static propTypes = {
		name: PropTypes.string,
		label: PropTypes.string,
		error: PropTypes.string,
		centered: PropTypes.bool,
		compact: PropTypes.bool,
		onSettings: PropTypes.func
	};


	static defaultProps = {
	};


	render(){
		const {classes, name, label, className, error, children, onSettings, ...otherProps} = this.props;

		const s = createStyle(style, className, classes, {
			root: {
				error
			}
		});

		return (
			<div {...otherProps} className={s.root}>
				{onSettings && <a onClick={onSettings} className={s.settings}>Settings</a>}

				<label className={s.label} htmlFor={name}>{label}</label>

				{children &&
					<div className={s.input}>
						{cloneElement(children, {name})}
					</div>
				}

				{error &&
					<div className={s.error}>{error}</div>
				}
			</div>

		);
	}
}