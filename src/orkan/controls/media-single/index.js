import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import firebase from 'firebase';

import Button from '../../button';
import Thumbnail from '../../thumbnail';
import {formInput} from '../../form';
import OrkanSpinner from '../../orkan-spinner';
import orkanInject from '../../orkan-inject';

import './style.scss';

@orkanInject()
@observer
export default class MediaSingle extends Component {
	static propTypes = {
		value: PropTypes.any,
		onChange: PropTypes.func,
	};


	static defaultProps = {
		onChange: () => null,
	};

	@observable obState = {
		isBusy: false
	};

	@autobind
	removeHandler(){
		const {onChange} = this.props;

		if(confirm('are you sure?')){
			onChange();
		}
	}

	@autobind
	async handleUpload(e){
		const {onChange} = this.props;
		e.stopPropagation();

		this.obState.isBusy = true;
		const file = this.input.files[0];
		let fileRef = firebase.storage().ref(file.name);
		const fileSnap = await fileRef.put(file);
		const downloadUrl = await fileSnap.ref.getDownloadURL();

		onChange(downloadUrl);

		this.obState.isBusy = false;

	}

	renderItem(){
		const {value} = this.props;

		if(!value){
			return null;
		}

		return (
			<Thumbnail
				imageSrc={value}
				onRemove={() => this.removeHandler()}/>
		);
	}

	render(){
		const {className, value} = this.props;
		const {isBusy} = this.obState;

		const newClassName = classNames('MediaSingle', className, {
			'MediaSingle-medium': true,
		});

		if(isBusy){
			return <OrkanSpinner/>
		}

		return (
			<div className={newClassName}>
				<input style={{display: 'none'}} ref={ref => this.input = ref} type="file" onChange={this.handleUpload}/>
				{!value && <Button primary onClick={() => this.input.click()}>upload</Button>}
				{this.renderItem()}
			</div>
		);
	}
}


export const MediaSingleControl = formInput()(MediaSingle);