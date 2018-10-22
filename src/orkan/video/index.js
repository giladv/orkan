import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import Button from '../button';
import Img from '../img';
import Icon from '../orkan-icon';

import './style';
import OrkanActionButton from '../orkan-action-button';

@autobind
export default class Video extends Component {

	static propTypes = {
		src: PropTypes.string,
		ratio: PropTypes.number,
		controls: PropTypes.bool,
	};

	static defaultProps = {
	};

	render(){
		const {className, src, ratio, controls, ...otherProps} = this.props;

		const newClassName = classNames('Video', className);

		return (
			<div {...otherProps} className={newClassName} style={{paddingTop: ratio + '%'}}>
				<video controls={controls}>
					<source src={src} type="video/mp4"/>
					Your browser does not support this ormat
				</video>
			</div>
		);
	}
}
