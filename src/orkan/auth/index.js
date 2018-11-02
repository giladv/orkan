import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';

import Spinner from '../spinner';
import FirebaseAuth from '../firebase-auth';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';


@observer
export default class Auth extends Component{

	static propTypes = {
		auth: PropTypes.object.isRequired
	};

	static defaultProps = {
	};

	@observable obState = {
		isBusy: false
	};

	@autobind
	handleSuccess(user){
		this.obState.isBusy = true;
	}

	render(){
		const {className, auth, classes} = this.props;
		const {isBusy} = this.obState;
		const s = createStyle(style, className, classes);

		return (
			<div className={s.root}>
				<h2 className={s.header}>Sign-in to Orkan</h2>
				{isBusy && <Spinner className={s.spinner}/>}
				{!isBusy &&
					<FirebaseAuth className={s.auth} auth={auth} onSuccess={this.handleSuccess}/>
				}
			</div>
		);
	}
}