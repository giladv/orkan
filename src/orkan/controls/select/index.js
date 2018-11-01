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
		error: PropTypes.bool
	};

	static defaultProps = {
		size: 'medium',
		options: [],
		onChange: () => null,
		handleLabel: option => option.label
	};

	@observable state = {
		isOpen: false
	};

	@autobind
	handleToggle(){
		const {isOpen} = this.state;

		if(!isOpen){
			this.openOptions();
		}else{
			this.closeOptions();
		}
	}

	@autobind
	closeOptions(){
		this.state.isOpen = false;
	}

	@autobind
	openOptions(){
		this.state.isOpen = true;
	}

	@autobind
	handleSelect(option){
		const {onChange} = this.props;
		this.closeOptions();
		onChange(option.value);
	}

	render(){
		const {className, classes, value, options, handleLabel, placeholder, size, ...otherProps} = this.props;
		const {isOpen} = this.state;

		const selectedOption = options.find(option => option.value === value);

		const s = createStyle(style, className, classes, style[size], {
			root: {
				open: isOpen,
				noValue: !selectedOption
			}
		});

		return (
			<DropdownContainer {...otherProps} className={s.root} options={options} onSelect={this.handleSelect} isOpen={isOpen} onClose={this.closeOptions}>
				<div className={s.selectedOption} onClick={this.handleToggle}>
					{selectedOption?handleLabel(selectedOption):placeholder}
				</div>
				<a className={s.toggleButton} onClick={this.handleToggle}><Icon type='play'/></a>
			</DropdownContainer>
		);
	}
}


export const SelectControl = formInput()(Select);