import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import OrkanIcon from '../orkan-icon';

import './style.scss';

@observer
export default class OrkanActionButton extends Component{
	static propTypes = {
		icon: PropTypes.string
	};

	static defaultProps = {
	};

	render(){
		const {className, icon, ...otherProps} = this.props;

		const newClassName = classNames('OrkanActionButton', className);

		return (
			<OrkanIcon {...otherProps} className={newClassName} type={icon} />
		);
	}
}