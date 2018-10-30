import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import ReactQuill from 'react-quill';

import {formInput} from '../../form';

import 'react-quill/dist/quill.snow.css';
import './style';

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

		const newClassName = classNames('Wysiwyg', className, {
			'Wysiwyg-disabled': disabled
		});

		return (
			<ReactQuill
				{...otherProps}
				className={newClassName}
				onChange={onChange}
				value={value}/>
		);
	}
}

export const WysiwygControl = formInput()(Wysiwyg);
