import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';

import Thumbnail from '../../thumbnail';
import {formInput} from '../../form';
import orkanInject from '../../orkan-inject';

import './style.scss';
import OrkanMediaGallery from '../../orkan-media-gallery';

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
		const {className, value, orkan, onChange} = this.props;

		const newClassName = classNames('Media', className, {
			'Media-medium': true,
		});

		return (
			<Thumbnail
				className={newClassName}
				buttons={[
					{icon: 'picture', onClick: () => orkan.openModal(OrkanMediaGallery).then(value => onChange(value)).catch(err => null)},
					value && {icon: 'clear', onClick: () => onChange(null)},
				]}
				src={value || undefined}/>
		);
	}
}


export const MediaControl = formInput()(Media);