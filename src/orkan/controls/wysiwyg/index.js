import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import ReactQuill from 'react-quill';

import {formInput} from '../../form';
import {createStyle} from '../../utils/style-utils';

import 'react-quill/dist/quill.snow.css';
import style from './style';

@observer
export default class Wysiwyg extends Component {

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
			<ReactQuill
				{...otherProps}
				className={s.root}
				onChange={onChange}
				value={value || ''}/>
		);
	}
}

export const WysiwygControl = formInput()(Wysiwyg);
