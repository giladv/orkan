import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import OrkanIcon from '../orkan-icon';

import './style.scss';

@observer
export default class OrkanListItem extends Component{
	static propTypes = {
		buttons: PropTypes.arrayOf(PropTypes.shape({
			icon: PropTypes.string,
			onClick: PropTypes.func
		}))
	};

	static defaultProps = {
		buttons: []
	};

	render(){
		const {className, buttons, children, ...otherProps} = this.props;

		const newClassName = classNames('OrkanListItem', className);

		return (
			<div {...otherProps} className={newClassName}>
				<div className="OrkanListItem-label">{children}</div>
				{buttons.filter(it => !!it).map(button => (
					<OrkanIcon type={button.icon} onClick={button.onClick}/>
				))}
			</div>
		);
	}
}