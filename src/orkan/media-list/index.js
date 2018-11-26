import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import map from 'lodash/map';
import {MEDIA_KEY} from '../constants';

import inject from '../inject';
import Thumbnail from '../thumbnail';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';

@inject(({filter}) => {
	const isAll = filter === 'all';
	return {
		media: {
			path: MEDIA_KEY,
			where: !isAll && {type: {'==': filter}}
		}
	};
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
		const {className, classes, onRemove, onSelect, media} = this.props;

		const s = createStyle(style, className, classes);

		return (
			<div className={s.root}>
				{media.map(item => (
					<Thumbnail className={s.thumbnail} key={item.$key} src={item.url} leftLabel={item.name} buttons={[
							{icon: 'v', onClick: () => onSelect(item)},
							{icon: 'trash', onClick: () => onRemove(item.$key, item)},
						]}/>
				))}
			</div>
		);
	}
}

