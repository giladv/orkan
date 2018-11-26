import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import firebase from 'firebase/app';

import Header from '../header';
import Select from '../controls/select';
import inject from '../inject';
import UploadButton from '../upload-button';
import {FIREBASE_APP_NAME, MEDIA_KEY} from '../constants';
import {createStyle} from '../utils/style-utils';
import MediaList from '../media-list';

import style from './style.scss';

@inject()
@observer
export default class MediaGallery extends Component{

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
	async handleUploadComplete(filesMetaData){
		const {orkan} = this.props;
		this.obState.isBusy = true;
		await Promise.all(filesMetaData.map(metaData => orkan.store.setValue(MEDIA_KEY, metaData)));
		this.obState.isBusy = false;
	}

	@autobind
	async handleRemove(key, media){
		const {orkan} = this.props;
		if(!confirm('are you sure?')){
			return;
		}
		let fileRef = firebase.storage(firebase.app(FIREBASE_APP_NAME)).ref(media.fullPath);
		fileRef.delete();

		orkan.store.remove(MEDIA_KEY + '/' + key);

	}

	render(){
		const {className, classes, resolve, reject} = this.props;
		const {filter} = this.obState;
		const s = createStyle(style, className, classes);

		const filterOptions = [
			{label: 'Show All', value: 'all'},
			{label: 'Images', value: 'image'},
			{label: 'Video', value: 'video'},
			{label: 'Audio', value: 'audio'},
		];

		return (
			<div className={s.root}>
				<Header primary className={s.header} onActionClick={reject} title='Media Gallery'/>
				<div className={s.actions}>
					<Select value={filter} onChange={value => this.obState.filter = value} options={filterOptions}/>
					<UploadButton onComplete={this.handleUploadComplete}/>
				</div>
				<MediaList filter={filter} onRemove={this.handleRemove} onSelect={media => resolve(media.url)}/>
			</div>
		);
	}
}
