import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import firebase from 'firebase/app';

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
		const file = this.input.files[0];
		let fileRef = firebase.storage(firebase.app(FIREBASE_APP_NAME)).ref(file.name);

		const snapshot = await fileRef.put(file);

		const {contentType, name, fullPath, size, timeCreated} = snapshot.metadata;

		const downloadUrl = await fileRef.getDownloadURL();

		onComplete({url: downloadUrl, mimeType: contentType, name, fullPath, size, timeCreated});

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
				<input style={{display: 'none'}} ref={ref => this.input = ref} type="file" onChange={this.handleUpload}/>
				upload
			</Button>
		);
	}
}
