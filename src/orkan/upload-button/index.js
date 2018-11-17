import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import firebase from 'firebase/app';
import uuid from 'uuid/v4';
import map from 'lodash/map';

import Button from '../button';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';
import {FIREBASE_APP_NAME} from '../constants';

@observer
export default class UploadButton extends Component {
	static propTypes = {
		onComplete: PropTypes.func,
	};


	static defaultProps = {
		onComplete: () => null,
	};

	@observable obState = {
		isBusy: false
	};

	@autobind
	async handleUpload(e){
		try{

		const {onComplete} = this.props;
		e.stopPropagation();

		this.obState.isBusy = true;

		const filesResult = await Promise.all(map(this.input.files, async file => {
			const fileExt = file.name.split('.').slice(-1)[0];
			const newFileName = uuid() + '.' + fileExt;

			let fileRef = firebase.storage(firebase.app(FIREBASE_APP_NAME)).ref(newFileName);

			const snapshot = await fileRef.put(file);

			const {contentType, name, fullPath, size, timeCreated} = snapshot.metadata;

			const downloadUrl = await fileRef.getDownloadURL();

			return {url: downloadUrl, mimeType: contentType, name, fullPath, size, timeCreated};
		}));


		onComplete(filesResult);

		this.obState.isBusy = false;
		}catch(err){
			console.log(err)
		}
	}

	render(){
		const {className} = this.props;
		const {isBusy} = this.obState;

		const s = createStyle(style, className);

		return (
			<Button className={s.root} isBusy={isBusy} primary onClick={() => this.input.click()}>
				<input multiple style={{display: 'none'}} ref={ref => this.input = ref} type="file" onChange={this.handleUpload}/>
				upload
			</Button>
		);
	}
}
