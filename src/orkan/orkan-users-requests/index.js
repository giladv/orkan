import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {map} from 'lodash';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';


import OrkanIcon from '../orkan-icon';
import orkanInject from '../orkan-inject';
import Img from '../img';
import OrkanListItem from '../orkan-list-item';
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
					<OrkanListItem key={uid} className="OrkanUsersRequests-request" buttons={[
						{icon: 'v', onClick: () => onApprove(uid)},
						{icon: 'clear', onClick: () => onDecline(uid)}
					]}>
						<Img src={request.avatarUrl}/>
						{request.email}
					</OrkanListItem>
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
					<OrkanIcon type='user'/>
					<span className='OrkanUsersRequests-title'>{totalRequests} User request{totalRequests > 1?'s':''}</span>
					<OrkanIcon type='play' className='OrkanUsersRequests-toggle-button'/>
				</div>
				{isOpen && this.renderRequests()}

			</div>
		);
	}
}