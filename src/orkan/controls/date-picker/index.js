import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import dateFormat from 'dateformat';
import {observer} from 'mobx-react';
import{observable} from 'mobx';

import {default as ThirdPartyDatePicker} from '../../date-picker';
import {formInput} from '../../form';
import DropdownContainer from '../../dropdown-container';
import Input from '../input';
import {createStyle} from '../../utils/style-utils';

import style from './style';


@observer
export default class DatePicker extends Component {
	static propTypes = {
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
		if(isNaN(Date.parse(value))){
			return '';
		}

		try{
			return dateFormat(new Date(value), 'dd/mm/yyyy');
		}catch(err){}
	}

	render(){
		const {className, value, onChange, disabled, ...otherProps} = this.props;
		const {isOpen} = this.obState;

		const s = createStyle(style, className, {
			root: {
				disabled
			}
		});

		const picker = <ThirdPartyDatePicker className={s.picker} date={value} onDayClick={this.handleDayClick}/>;

		return (
			<DropdownContainer className={s.root} classes={{optionsList: s.optionsList}} renderOption={() => picker} options={[{label: 1, value: 1}]} isOpen={isOpen} onClose={() => this.obState.isOpen = false}>
				<Input {...otherProps} className={s.input} preIcon="calendar" value={this.formatDate(value)} onFocus={() => this.obState.isOpen = true}/>
			</DropdownContainer>
		);
	}
}


export const DatePickerControl = formInput()(DatePicker);