import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observable} from 'mobx';
import {observer} from 'mobx-react';

import {keyboard} from '../utils/keyboard-utils';

import './style';

@observer
export default class DropdownContainer extends Component {

	static propTypes = {
		options: PropTypes.array,
		isOpen: PropTypes.bool,
		onClose: PropTypes.func,
		renderOption: PropTypes.func,
		onSelect: PropTypes.func,
	};

	static defaultProps = {
		options: [],
		onSelect: option => null,
		onClose: () => null,
		renderOption: () => null
	};

	@observable state = {
		selectedOptionIndex: 0
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
		this.refs['option'+this.state.selectedOptionIndex].scrollIntoView(false);
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
		const {className, children, options, isOpen, onSelect, ...otherProps} = this.props;
		const {selectedOptionIndex} = this.state;

		const newClassName = classNames('DropdownContainer', className, {
			'DropdownContainer-open': isOpen,
			'DropdownContainer-medium': true
		});

		return (
			<div {...otherProps} className={newClassName} tabIndex="0" onBlur={this.handleClose}>
				{children}
				{isOpen &&
					<ul className="DropdownContainer-options" onMouseDown={e => e.preventDefault()}>
						{options.map((option, i) => (
							<li key={i} ref={'option' + i} className={classNames({'DropdownContainer-options-selected': selectedOptionIndex === i})} onMouseDown={() => this.selectOption(option)}>{this.renderOption(option)}</li>
						))}
						{!options.length &&
							<li className="DropdownContainer-options-empty">No options available</li>
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
	};


	static defaultProps = {
	};

	render(){

		const {className, label, ...otherProps} = this.props;

		const newClassName = classNames('DropdownOption', className, {
			'DropdownOption-small': true
		});

		return (
			<div {...otherProps} className={newClassName}>
				{label}
			</div>
		);

	}
}
