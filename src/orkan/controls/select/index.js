import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {formInput} from '../../form';
import DropdownContainer from '../../dropdown-container';
import Icon from '../../icon';
import {createStyle} from '../../utils/style-utils';

import style from './style';

@observer
export default class Select extends Component {

	static propTypes = {
		value: PropTypes.any,
		options: PropTypes.array,
		placeholder: PropTypes.string,
		handleLabel: PropTypes.func,
		size: PropTypes.oneOf(['small', 'medium', 'large']),
		onChange: PropTypes.func,
		error: PropTypes.bool,
		autoFocus: PropTypes.bool
	};

	static defaultProps = {
		size: 'medium',
		options: [],
		onChange: () => null,
		handleLabel: option => option.label
	};

	componentDidMount(){
		const {autoFocus} = this.props;
		autoFocus && ReactDOM.findDOMNode(this.dropdownContainer).focus();
	}


	@autobind
	handleSelect(option){
		const {onChange} = this.props;
		onChange(option.value);
	}

	render(){
		const {className, classes, value, options, handleLabel, placeholder, size, ...otherProps} = this.props;

		const selectedOption = options.find(option => option.value === value);

		const s = createStyle(style, className, classes, style[size], {
			root: {
				noValue: !selectedOption
			}
		});

		return (
			<DropdownContainer {...otherProps} ref={ref => this.dropdownContainer = ref} className={s.root} options={options} onSelect={this.handleSelect} initialActiveOptionIndex={options.indexOf(selectedOption)}>
				<div className={s.selectedOption} onClick={this.handleToggle}>
					{selectedOption?handleLabel(selectedOption):placeholder}
				</div>
				<a className={s.toggleButton} onClick={this.handleToggle}><Icon type='play'/></a>
			</DropdownContainer>
		);
	}
}


export const SelectControl = formInput()(Select);