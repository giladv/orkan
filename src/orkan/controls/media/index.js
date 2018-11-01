import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';

import Thumbnail from '../../thumbnail';
import {formInput} from '../../form';
import orkanInject from '../../orkan-inject';
import OrkanMediaGallery from '../../orkan-media-gallery';
import {createStyle} from '../../utils/style-utils';

import style from './style.scss';

@orkanInject()
@observer
export default class Media extends Component {
	static propTypes = {
		value: PropTypes.any,
		onChange: PropTypes.func
	};


	static defaultProps = {
		onChange: () => null,
	};


	render(){
		const {className, value, orkan, onChange, ...otherProps} = this.props;

		const s = createStyle(style, className);

		return (
			<Thumbnail
				{...otherProps}
				className={s.root}
				buttons={[
					{icon: 'picture', onClick: () => orkan.openModal(OrkanMediaGallery).then(value => onChange(value)).catch(err => null)},
					value && {icon: 'clear', onClick: () => onChange(null)},
				]}
				src={value || undefined}/>
		);
	}
}


export const MediaControl = formInput()(Media);