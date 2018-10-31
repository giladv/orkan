import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import {createStyle} from '../utils/style-utils';

import style from './style.scss';

export default class Indicator extends Component{
	static propTypes = {
		isBusy: PropTypes.bool
	};

	render(){
		const {className, isBusy} = this.props;

		const s = createStyle(style, className, {
			root: {
				notBusy: !isBusy, // without this stupid thing, css animations wont stop!
				busy: isBusy
			}
		});

		return <div className={s.root}/>
	}
}