import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import map from 'lodash/map';
import firebase from 'firebase/app';

import Spinner from '../spinner';
import Header from '../header';
import Select from '../controls/select';
import orkanInject from '../orkan-inject';
import Thumbnail from '../thumbnail';
import UploadButton from '../upload-button';

import 'firebaseui/dist/firebaseui.css';
import './style.scss';
import {MEDIA_KEY_NAME} from '../constants';

@orkanInject()
@observer
export default class OrkanMediaGallery extends Component{

	static propTypes = {
		resolve: PropTypes.func,
		reject: PropTypes.func,
	};

	static defaultProps = {
		resolve: () => null,
		reject: () => null,
	};

	@observable obState = {
		isBusy: false,
		filter: 'all'
	};

	getMediaType(mimeType){
		return mimeType.split('/')[0];
	}

	@autobind
	async handleUploadComplete(metaData){
		const {orkan} = this.props;
		this.obState.isBusy = true;
		const path = MEDIA_KEY_NAME + '/' + this.getMediaType(metaData.mimeType)
		const {key} = orkan.store.push(path);

		await orkan.store.setValue(path + '/' + key, metaData);
		this.obState.isBusy = false;
	}

	@autobind
	async handleRemove(key, media){
		const {orkan} = this.props;
		if(!confirm('are you sure?')){
			return;
		}
		let fileRef = firebase.storage().ref(media.fullPath);
		fileRef.delete();

		const path = MEDIA_KEY_NAME + '/' + this.getMediaType(media.mimeType) + '/' + key;
		orkan.store.remove(path);

	}

	render(){
		const {className, resolve, reject} = this.props;
		const {filter} = this.obState;

		const newClassName = classNames('OrkanMediaGallery', className);
		const filterOptions = [
			{label: 'Show All', value: 'all'},
			{label: 'Images', value: 'image'},
			{label: 'Video', value: 'video'},
			{label: 'Audio', value: 'audio'},
		];

		return (
			<div className={newClassName}>
				<Header primary onClose={reject} title='Media Gallery'/>
				<div className="OrkanMediaGallery-actions">
					<Select value={filter} onChange={value => this.obState.filter = value} options={filterOptions}/>
					<UploadButton onComplete={this.handleUploadComplete}/>
				</div>
				<OrkanMediaList filter={filter} onRemove={this.handleRemove} onSelect={media => resolve(media.url)}/>
			</div>
		);
	}
}


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
export class OrkanMediaList extends Component{

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
		const {className, image = {}, video = {}, audio = {}, onRemove, onSelect} = this.props;

		const media = {...image, ...video, ...audio};

		const newClassName = classNames('OrkanMediaList', className);

		return (
			<div className={newClassName}>
				{map(media, (item, key) => (
					<Thumbnail key={key} src={item.url} leftLabel={item.name} buttons={[
							{icon: 'v', onClick: () => onSelect(item)},
							{icon: 'trash', onClick: () => onRemove(key, item)},
						]}/>
				))}
			</div>
		);
	}
}

