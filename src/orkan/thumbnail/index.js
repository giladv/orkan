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
		isSelected: PropTypes.bool,
		isPlaceholder: PropTypes.bool,
		imageSrc: PropTypes.string,
		imageAlt: PropTypes.string,
		leftLabel: PropTypes.string,
		rightLabel: PropTypes.string,
		onRemove: PropTypes.func,
		onSelect: PropTypes.func,
	};

	static defaultProps = {
	};

	getFileType(){
		const {imageSrc} = this.props;

		switch (path.extname(imageSrc).split('?')[0].slice(1)){
			case 'gif':
			case 'jpg':
			case 'svg':
			case 'png':
				return 'image';
			case 'mp4':
			case 'mov':
			case 'ogg':
				return 'video';
		}
	}

	render(){
		const {className, imageSrc, imageAlt, leftLabel, rightLabel, isSelected, isPlaceHolder, onRemove, onSelect, ...otherProps} = this.props;

		const newClassName = classNames('Thumbnail', className, {
			'Thumbnail-medium': true,
			'Thumbnail-selected': isSelected,
			'Thumbnail-placeholder': isPlaceHolder
		});

		const fileType = this.getFileType();

		return (
			<div {...otherProps} className={newClassName}>
				<div className="Thumbnail-actions-container">
					<div className="Thumbnail-actions">
						{onSelect && <OrkanActionButton icon='v' onClick={onSelect}/>}
						{onRemove && <OrkanActionButton icon='trash' onClick={onRemove}/>}
					</div>
					{fileType === 'image' && <Img mode='cover' src={imageSrc} alt={imageAlt} ratio={60}/>}
					{fileType === 'video' && <Video src={imageSrc} ratio={60}/>}
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
