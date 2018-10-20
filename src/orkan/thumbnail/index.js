import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import Button from '../button';
import Img from '../img';
import Icon from '../orkan-icon';

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
	};

	static defaultProps = {
	};

	render(){
		const {className, imageSrc, imageAlt, leftLabel, rightLabel, isSelected, isPlaceHolder, onRemove, ...otherProps} = this.props;

		const newClassName = classNames('Thumbnail', className, {
			'Thumbnail-medium': true,
			'Thumbnail-selected': isSelected,
			'Thumbnail-placeholder': isPlaceHolder
		});

		return (
			<div {...otherProps} className={newClassName}>
				<div className="Thumbnail-actions">
					<Button important square onClick={onRemove}><Icon
						type="trash"/></Button>
				</div>
				<Img mode='cover' src={imageSrc} alt={imageAlt}/>
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
