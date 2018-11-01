import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {createStyle} from '../utils/style-utils';

import style from './style';

export default class Video extends Component {

	static propTypes = {
		src: PropTypes.string,
		ratio: PropTypes.number,
		controls: PropTypes.bool,
	};

	static defaultProps = {
	};

	render(){
		const {className, src, ratio, controls, classes, ...otherProps} = this.props;
		const s = createStyle(style, className, classes);

		return (
			<div {...otherProps} className={s.root} style={{paddingTop: ratio + '%'}}>
				<video controls={controls}>
					<source src={src} type="video/mp4"/>
					Your browser does not support this ormat
				</video>
			</div>
		);
	}
}
