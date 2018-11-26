import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import path from 'path';

import Img from '../img';
import ActionButton from '../action-button';
import Video from '../video';
import {createStyle} from '../utils/style-utils';

import style from './style';
import Icon from '../icon';

@autobind
export default class Thumbnail extends Component {

	static propTypes = {
		src: PropTypes.string,
		leftLabel: PropTypes.string,
		rightLabel: PropTypes.string,
		ratio: PropTypes.number,
		size: PropTypes.oneOf(['small', 'medium', 'large']),
		buttons: PropTypes.arrayOf(PropTypes.shape({
			icon: PropTypes.string,
			onClick: PropTypes.func,
			tooltip: PropTypes.node,
		})),
	};

	static defaultProps = {
		size: 'medium',
		ratio: 60,
		buttons: [],
		// src: require('./placeholder.png')
	};

	getFileType(){
		const {src} = this.props;

		switch (path.extname(src).split('?')[0].slice(1)){
			case 'gif':
			case 'jpg':
			case 'svg':
			case 'png':
			default:
				return 'image';
			case 'mp4':
			case 'mov':
			case 'ogg':
			case 'wmv':
				return 'video';
		}
	}

	render(){
		const {className, classes, src, leftLabel, rightLabel, buttons, ratio, size, ...otherProps} = this.props;

		const s = createStyle(style, className, classes, style[size]);

		const fileType = this.getFileType();
		const cleanButtons = buttons.filter(it => !!it);

		return (
			<div {...otherProps} className={s.root}>
				<div className={s.topContainer}>
					{cleanButtons.length > 0 &&
						<div className={s.actions}>
							{cleanButtons.map((button, i) => (
								<ActionButton className={s.actionButton} key={i} icon={button.icon} onClick={button.onClick} tooltip={button.tooltip}/>
							))}
						</div>
					}
					{!src &&
						<div className={s.placeholder} style={{paddingTop: ratio + '%'}}>
							<Icon className={s.placeholderIcon} type='picture'/>
						</div>
					}
					{src && fileType === 'image' && <Img className={s.img} mode='contain' src={src} ratio={ratio}/>}
					{src && fileType === 'video' && <Video className={s.video} src={src} ratio={ratio}/>}
				</div>
				{(leftLabel || rightLabel) &&
					<div className={s.content}>
						<div className={s.leftLabel}>{leftLabel}</div>
						<div className={s.rightLabel}>{rightLabel}</div>
					</div>

				}
			</div>
		);
	}
}
