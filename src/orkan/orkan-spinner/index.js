import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import SyncLoader from 'react-spinners/SyncLoader';

import './style.scss';


@observer
export default class OrkanSpinner extends Component{

	static propTypes = {
		size: PropTypes.string
	};

	static defaultProps = {
		size: 3
	};

	render(){
		const {className, size} = this.props;
		const newClassName = classNames('OrkanSpinner', className);

		return (
			<SyncLoader className={newClassName} {...sizes[size]} color='#d1d4de'/>
		);
	}
}



const sizes = {
	1: {size: 1, margin: '1px'},
	2: {size: 2, margin: '1.5px'},
	3: {size: 3, margin: '2px'}
};




