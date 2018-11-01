import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import map from 'lodash/map';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';


import Icon from '../icon';
import orkanInject from '../orkan-inject';
import Img from '../img';
import ListItem from '../list-item';
import {USER_REQUESTS_KEY_NAME} from '../constants';

import './style.scss';


@orkanInject(() => ({requests: USER_REQUESTS_KEY_NAME}), {liveEditedData: false})
@observer
export default class OrkanUsersRequests extends Component{
	static propTypes = {
		onApprove: PropTypes.func,
		onDecline: PropTypes.func
	};

	static defaultProps = {
		onApprove: () => null,
		onDecline: () => null
	};

	@observable obState = {
		isOpen: false
	};

	renderRequests(){
		const {requests, onApprove, onDecline} = this.props;

		return (
			<div className="OrkanUsersRequests-requests">
				{map(requests, (request, uid) => (
					<ListItem key={uid} className="OrkanUsersRequests-request" buttons={[
						{icon: 'v', onClick: () => onApprove(uid)},
						{icon: 'clear', onClick: () => onDecline(uid)}
					]}>
						<Img src={request.avatarUrl}/>
						{request.email}
					</ListItem>
				))}
			</div>
		);
	}

	render(){
		const {className, requests} = this.props;
		const {isOpen} = this.obState;

		const newClassName = classNames('OrkanUsersRequests', className);

		if(!requests){
			return null;
		}

		const totalRequests = Object.keys(requests).length;

		return (
			<div className={newClassName}>
				<div className="OrkanUsersRequests-header" onClick={() => this.obState.isOpen = !isOpen}>
					<Icon type='user'/>
					<span className='OrkanUsersRequests-title'>{totalRequests} User request{totalRequests > 1?'s':''}</span>
					<Icon type='play' className='OrkanUsersRequests-toggle-button'/>
				</div>
				{isOpen && this.renderRequests()}

			</div>
		);
	}
}