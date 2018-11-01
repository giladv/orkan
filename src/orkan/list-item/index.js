import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';

import ActionButton from '../action-button';
import {typeOrFalse} from '../utils/prop-types-utils';
import Img from '../img';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';

@observer
export default class ListItem extends Component{
	static propTypes = {
		image: PropTypes.string,
		buttons: PropTypes.arrayOf(typeOrFalse(PropTypes.shape({
			icon: PropTypes.string,
			onClick: PropTypes.func
		})))
	};

	static defaultProps = {
		buttons: []
	};

	handleButtonClick(e, button){
		e.stopPropagation();
		button.onClick(e);
	}

	render(){
		const {className, buttons, classes, children, image, ...otherProps} = this.props;
		const s = createStyle(style, className, classes);

		return (
			<div {...otherProps} className={s.root}>
				{image && <Img className={s.img} mode='cover' src={image}/>}
				<div className={s.label}>{children}</div>
				{buttons.filter(it => !!it).map((button, i) => (
					<ActionButton className={s.actionButton} key={i} icon={button.icon} onClick={e => this.handleButtonClick(e, button)} />
				))}
			</div>
		);
	}
}