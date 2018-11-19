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
		renderOption: PropTypes.func,
		initialActiveOptionIndex: PropTypes.number,
		onSelect: PropTypes.func,
	};

	static defaultProps = {
		size: 'medium',
		options: [],
		initialActiveOptionIndex: -1,
		onSelect: option => null,
		renderOption: () => null
	};

	@observable obState = {
		activeOptionIndex: -1,
		isOpen: false,
		isFocused: false
	};

	optionsElems = [];

	componentWillMount(){
		this.bindKeyboardEvents();
	}

	componentWillUnmount(){
		this.unbindKeyboardEvents();
	}

	scrollIntoView(){
		const elem = this.optionsElems[this.obState.activeOptionIndex];
		elem && elem.scrollIntoView(false);
	}

	bindKeyboardEvents(){
		keyboard.bind('up', this.handleUp);
		keyboard.bind('down', this.handleDown);
		keyboard.bind('enter', this.handleEnter);
		keyboard.bind('escape', this.handleEsc);
		keyboard.bind('space', this.handleSpace);
	}

	unbindKeyboardEvents(){
		keyboard.unbind('up', this.handleUp);
		keyboard.unbind('down', this.handleDown);
		keyboard.unbind('enter', this.handleEnter);
		keyboard.unbind('escape', this.handleEsc);
		keyboard.bind('space', this.handleSpace);
	}

	@autobind
	handleUp(e){
		const {options} = this.props;
		const {activeOptionIndex, isFocused, isOpen} = this.obState;

		if(!isFocused){return;}

		if(isOpen){
			if(activeOptionIndex === 0){
				this.obState.activeOptionIndex = options.length - 1;
			}else{
				this.obState.activeOptionIndex--;
			}
		}else{
			this.open();
		}


		this.scrollIntoView();

		e.preventDefault();
	}

	@autobind
	handleDown(e){
		const {options} = this.props;
		const {activeOptionIndex, isFocused, isOpen} = this.obState;

		if(!isFocused){return;}


		if(isOpen){
			if(activeOptionIndex === options.length - 1){
				this.obState.activeOptionIndex = 0;
			}else{
				this.obState.activeOptionIndex++;
			}
		}else{
			this.open();
		}

		this.scrollIntoView();

		e.preventDefault();
	}

	@autobind
	handleEnter(e){
		const {isOpen, isFocused} = this.obState;

		if(!isFocused){return;}

		if(isOpen){
			this.selectActiveOption();
		}
		e.preventDefault();
		e.stopPropagation();
	}

	@autobind
	handleBlur(e){
		this.obState.isFocused = false;
		this.close();
	}

	@autobind
	handleSpace(e){
		const {isFocused, isOpen} = this.obState;

		if(isFocused && !isOpen){
			this.open();
		}

		if(isOpen){
			this.selectActiveOption();
		}
	}

	@autobind
	handleEsc(e){
		this.close();
	}

	@autobind
	handleClick(e){
		const {isOpen} = this.obState;
		isOpen?this.close():this.open();
	}

	@autobind
	selectOption(optionIndex){
		const {options} = this.props;
		this.props.onSelect(options[optionIndex]);
		this.close();
	}

	selectActiveOption(){
		const {activeOptionIndex} = this.obState;
		activeOptionIndex > -1 && this.selectOption(activeOptionIndex);
	}

	open(){
		this.obState.isOpen = true;
		this.obState.activeOptionIndex = this.props.initialActiveOptionIndex;
	}

	close(){
		this.obState.isOpen = false;
		this.obState.activeOptionIndex = -1;
	}

	renderOption(option, isSelected){
		const {renderOption, size} = this.props;

		return renderOption(option, isSelected) || <DropdownOption selected={isSelected} label={option.label} size={size} />;
	}

	render(){
		const {className, children, options, onSelect, size, ...otherProps} = this.props;
		const {activeOptionIndex, isOpen} = this.obState;

		const s = createStyle(style, className, style[size], {
			root: {
				open: isOpen
			}
		});

		return (
			<div
				{...otherProps}
				className={s.root}
				tabIndex={0}
				onClick={this.handleClick}
				onBlur={this.handleBlur}
				onFocus={() => this.obState.isFocused = true}>
				{children}
				{isOpen &&
					<ul className={s.optionsList} onMouseDown={e => e.preventDefault()}>
						{options.map((option, i) => (
							<li
								key={i}
								ref={ref => this.optionsElems[i] = ref}
								onMouseDown={() => this.selectOption(i)}>
									{this.renderOption(option, activeOptionIndex === i)}
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
