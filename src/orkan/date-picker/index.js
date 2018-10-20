import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import DayPicker, { DateUtils } from 'react-day-picker';

import 'react-day-picker/lib/style.css';
import './style';

@autobind
export default class DatePicker extends Component{

	static propTypes = {
		date: PropTypes.string
	};

	constructor(props){
		super(props);
		const dateObj = this.props.date?new Date(this.props.date):new Date();
		this.modifiers = {
			// selected: day => DateUtils.isSameDay(day, dateObj)
		};
	}

	handleDayClick(day){
		var { onDayClick } = this.props;
		onDayClick && onDayClick(day);
	}

	render(){
		var {className, date, ...otherProps} = this.props;
		className = classNames('DatePicker', className);

		return (
			<DayPicker {...otherProps} className={className} selectedDays={new Date(date)} modifiers={this.modifiers} onDayClick={this.handleDayClick} />
		);
	}
}
