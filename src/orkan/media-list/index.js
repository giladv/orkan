import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import map from 'lodash/map';

import orkanInject from '../orkan-inject';
import Thumbnail from '../thumbnail';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';

@orkanInject(({filter}) => {

	if(filter === 'all'){
		return {
			image: 'media/image',
			video: 'media/video',
			audio: 'media/audio'
		};
	}else{
		return {
			[filter]: 'media/' + filter
		};
	}
}, {liveEditedData: false})
@observer
export default class MediaList extends Component{

	static propTypes = {
		filter: PropTypes.oneOf(['all', 'image', 'video', 'audio']),
		onSelect: PropTypes.func,
		onRemove: PropTypes.func,
	};

	static defaultProps = {
		onRemove: () => null,
		onSelect: () => null,
	};

	render(){
		const {className, classes, image = {}, video = {}, audio = {}, onRemove, onSelect} = this.props;

		const media = {...image, ...video, ...audio};

		const s = createStyle(style, className, classes);

		return (
			<div className={s.root}>
				{map(media, (item, key) => (
					<Thumbnail className={s.thumbnail} key={key} src={item.url} leftLabel={item.name} buttons={[
							{icon: 'v', onClick: () => onSelect(item)},
							{icon: 'trash', onClick: () => onRemove(key, item)},
						]}/>
				))}
			</div>
		);
	}
}

