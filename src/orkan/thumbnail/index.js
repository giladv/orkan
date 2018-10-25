import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import path from 'path';

import Img from '../img';
import OrkanActionButton from '../orkan-action-button';
import Video from '../video';

import './style';

@autobind
export default class Thumbnail extends Component {

	static propTypes = {
		src: PropTypes.string,
		leftLabel: PropTypes.string,
		rightLabel: PropTypes.string,
		ratio: PropTypes.number,
		buttons: PropTypes.arrayOf(PropTypes.shape({
			icon: PropTypes.string,
			onClick: PropTypes.func
		})),
	};

	static defaultProps = {
		ratio: 60,
		buttons: [],
		src: require('./placeholder.png')
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
		const {className, src, leftLabel, rightLabel, buttons, ratio, ...otherProps} = this.props;

		const newClassName = classNames('Thumbnail', className, {
			'Thumbnail-medium': true,
		});

		const fileType = this.getFileType();
		const cleanButtons = buttons.filter(it => !!it);

		return (
			<div {...otherProps} className={newClassName}>
				<div className="Thumbnail-actions-container">
					{cleanButtons.length > 0 &&
						<div className="Thumbnail-actions">
							{cleanButtons.map(button => (
								<OrkanActionButton icon={button.icon} onClick={button.onClick}/>
							))}
						</div>
					}
					{fileType === 'image' && <Img mode='cover' src={src} ratio={ratio}/>}
					{fileType === 'video' && <Video src={src} ratio={ratio}/>}
				</div>
				{(leftLabel || rightLabel) &&
					<div className="Thumbnail-content">
						<div className="Thumbnail-left-label">{leftLabel}</div>
						<div className="Thumbnail-right-label">{rightLabel}</div>
					</div>

				}
			</div>
		);
	}
}
