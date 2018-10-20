import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import dateFormat from 'dateformat';
import {observer} from 'mobx-react';
import{observable} from 'mobx';

import {default as ThirdPartyDatePicker} from '../../date-picker';
import {formInput} from '../../form';
import DropdownContainer from '../../dropdown-container';
import {InputControl} from '../input';

import './style';


@observer
export default class DatePicker extends Component {
	static PropTypes = {
		value: PropTypes.string,
		placeholder: PropTypes.string,
		onChange: PropTypes.func,
		disabled: PropTypes.bool,
	};

	static defaultProps = {
		onChange: () => null,
	};

	@observable obState = {
		isOpen: false
	};

	@autobind
	handleDayClick(day){
		this.props.onChange(day.toISOString());
	}

	formatDate(value){
		try{
			return dateFormat(new Date(value), 'dd/mm/yyyy');
		}catch(err){
			return value;
		}
	}

	render(){
		const {className, value, onChange, ...otherProps} = this.props;
		const {isOpen} = this.obState;

		const newClassName = classNames('DatePicker', className, {
			'DatePicker-medium': true,
		})

		// return <ThirdPartyDatePicker date={value} onMouseDown={e => e.preventDefault()} onDayClick={this.handleDayClick}/>;
		const tooltip = (
			// <Tooltip seamless>
				<ThirdPartyDatePicker date={value} onDayClick={this.handleDayClick}/>
			// </Tooltip>
		);

		return (
			<DropdownContainer className={newClassName} renderOption={() => tooltip} options={[{label: 1, value: 1}]} isOpen={isOpen} onClose={() => this.obState.isOpen = false}>
				<InputControl {...otherProps} className={newClassName} preIcon="calendar" value={this.formatDate(value)} onFocus={() => this.obState.isOpen = true}/>
			</DropdownContainer>
		);
	}
}


export const DatePickerControl = formInput()(DatePicker);