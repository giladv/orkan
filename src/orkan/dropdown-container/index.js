import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observable} from 'mobx';
import {observer} from 'mobx-react';

import {keyboard} from '../utils/keyboard-utils';
import {createStyle} from '../utils/style-utils';

import style from './style';
import dropdownOptionStore from './dropdown-option-style.scss';

@observer
export default class DropdownContainer extends Component {

	static propTypes = {
		options: PropTypes.array,
		size: PropTypes.oneOf(['small', 'medium', 'large']),
		isOpen: PropTypes.bool,
		onClose: PropTypes.func,
		renderOption: PropTypes.func,
		onSelect: PropTypes.func,
	};

	static defaultProps = {
		size: 'medium',
		options: [],
		onSelect: option => null,
		onClose: () => null,
		renderOption: () => null
	};

	@observable state = {
		selectedOptionIndex: -1
	};

	componentWillMount(){
		this.props.isOpen && this.bindKeyboardEvents();
	}

	componentWillReceiveProps(nextProps){
		if(this.props.isOpen !== nextProps.isOpen){
			nextProps.isOpen?this.bindKeyboardEvents():this.unbindKeyboardEvents();
		}
	}

	componentWillUnmount(){
		this.unbindKeyboardEvents();
	}

	scrollIntoView(){
		const elem = this.refs['option'+this.state.selectedOptionIndex];
		elem && elem.scrollIntoView(false);
	}
	bindKeyboardEvents(){
		keyboard.bind('up', this.handleUp);
		keyboard.bind('down', this.handleDown);
		keyboard.bind('enter', this.handleEnter);
		keyboard.bind('escape', this.handleClose);
	}

	unbindKeyboardEvents(){
		keyboard.unbind('up', this.handleUp);
		keyboard.unbind('down', this.handleDown);
		keyboard.unbind('enter', this.handleEnter);
		keyboard.unbind('escape', this.handleClose);
	}

	@autobind
	handleUp(e){
		const {options} = this.props;
		const {selectedOptionIndex} = this.state;

		if(selectedOptionIndex === 0){
			this.state.selectedOptionIndex = options.length - 1;
		}else{
			this.state.selectedOptionIndex--;
		}

		this.scrollIntoView();

		e.preventDefault();
	}

	@autobind
	handleDown(e){
		const {options} = this.props;
		const {selectedOptionIndex} = this.state;

		if(selectedOptionIndex === options.length - 1){
			this.state.selectedOptionIndex = 0;
		}else{
			this.state.selectedOptionIndex++;
		}

		this.scrollIntoView();

		e.preventDefault();
	}

	@autobind
	handleEnter(e){
		const {options, isOpen} = this.props;
		const {selectedOptionIndex} = this.state;
		if(!isOpen){
			return;
		}
		this.selectOption(options[selectedOptionIndex]);
		e.preventDefault();
		e.stopPropagation();
	}

	@autobind
	handleClose(e){
		this.props.onClose();
		e.preventDefault();
		e.stopPropagation();
	}

	@autobind
	selectOption(option){
		this.props.onSelect(option);
	}

	renderOption(option){
		const {renderOption, size, theme} = this.props;

		return renderOption(option, size, theme) || <DropdownOption label={option.label} size={size} theme={theme} />;
	}

	render(){
		const {className, children, options, isOpen, onSelect, size, ...otherProps} = this.props;
		const {selectedOptionIndex} = this.state;

		const s = createStyle(style, className, style[size], {
			root: {
				open: isOpen
			}
		});

		return (
			<div {...otherProps} className={s.root} tabIndex="0" onBlur={this.handleClose}>
				{children}
				{isOpen &&
					<ul className={s.optionsList} onMouseDown={e => e.preventDefault()}>
						{options.map((option, i) => (
							<li
								key={i}
								ref={'option' + i}
								className={classNames(s.option, {[s.selectedOption]: selectedOptionIndex === i})}
								onMouseDown={() => this.selectOption(option)}>
									{this.renderOption(option)}
							</li>
						))}
						{!options.length &&
							<li className={s.emptyOption}>No options available</li>
						}
					</ul>
				}
			</div>
		);
	}
}





export class DropdownOption extends Component {

	static propTypes = {
		label: PropTypes.string,
		size: PropTypes.oneOf(['small', 'medium', 'large']),
		selected: PropTypes.bool
	};


	static defaultProps = {
		size: 'medium'
	};

	render(){

		const {className, label, size, selected, ...otherProps} = this.props;

		const s = createStyle(dropdownOptionStore, className, dropdownOptionStore[size], {
			root: {
				selected
			}
		});

		return (
			<div {...otherProps} className={s.root}>
				{label}
			</div>
		);

	}
}
