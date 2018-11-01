import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import SyncLoader from 'react-spinners/SyncLoader';

import {createStyle} from '../utils/style-utils';

import style from './style.scss';

@observer
export default class Spinner extends Component{

	static propTypes = {
		size: PropTypes.string
	};

	static defaultProps = {
		size: 3
	};

	render(){
		const {className, size} = this.props;

		const s = createStyle(style, className);

		return (
			<SyncLoader className={s.root} {...sizes[size]} color='#d1d4de'/>
		);
	}
}



const sizes = {
	1: {size: 1, margin: '1px'},
	2: {size: 2, margin: '1.5px'},
	3: {size: 3, margin: '2px'}
};




