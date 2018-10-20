import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import Button from '../button';
import OrkanIcon from '../orkan-icon';

import './style.scss';


@observer
export default class OrkanHeader extends Component{

	static propTypes = {
		primary: PropTypes.bool,
		title: PropTypes.any,
		onClose: PropTypes.func,
		onCreate: PropTypes.func,
	};

	static defaultProps = {
	};

	render(){
		const {className, onClose, title, primary, onCreate} = this.props;

		const newClassName = classNames('OrkanHeader', className, {
			'OrkanHeader-primary': primary
		});

		return (
			<h2 className={newClassName}>
				<div className="OrkanHeader-title">{title}</div>
				{onClose && <OrkanIcon type='close' onClick={onClose}/>}
				{onCreate && <Button primary onClick={onCreate}>create</Button>}
			</h2>
		);
	}
}