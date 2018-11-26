import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import Header from '../header';
import OrkanStore from '../orkan-store';

import Spinner from '../spinner';
import FirebaseAuth from '../firebase-auth';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';


@observer
export default class Auth extends Component{

	static propTypes = {
		store: PropTypes.instanceOf(OrkanStore)
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
		const {className, store, classes} = this.props;
		const {isBusy} = this.obState;
		const s = createStyle(style, className, classes);

		return (
			<div className={s.root}>
				<h2 className={s.header}>Sign-in to Orkan</h2>
				{store.isInvitationSent &&
					<div className={s.invitationSent}>
						<strong>Unauthorized</strong>
						A request was sent to the admin.
						<br/>
						<a>close</a>
					</div>
				}
				{isBusy && <Spinner className={s.spinner}/>}
				{!isBusy && !store.isInvitationSent &&
					<FirebaseAuth className={s.auth} onSuccess={this.handleSuccess}/>
				}
			</div>
		);
	}
}