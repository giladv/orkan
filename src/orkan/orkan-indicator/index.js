import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import './style.scss';

export default class OrkanIndicator extends Component{
	static propTypes = {
		isBusy: PropTypes.bool
	};

	render(){
		const {className, isBusy} = this.props;
		const newClassName = classNames('OrkanIndicator', className, {
			'OrkanIndicator-not-busy': !isBusy, // without this stupid thing, css animations wont stop!
			'OrkanIndicator-busy': isBusy
		});
		return <div className={newClassName}/>
	}
}