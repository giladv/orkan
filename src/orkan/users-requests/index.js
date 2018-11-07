import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import map from 'lodash/map';
import {observable} from 'mobx';


import Icon from '../icon';
import inject from '../inject';
import ListItem from '../list-item';
import {USER_REQUESTS_KEY_NAME} from '../constants';
import {createStyle} from '../utils/style-utils';

import style from './style.scss';


@inject(() => ({requests: USER_REQUESTS_KEY_NAME}), {liveEditedData: false})
@observer
export default class UsersRequests extends Component{
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
			<div>
				{map(requests, (request, uid) => (
					<ListItem key={uid} image={request.avatarUrl} buttons={[
						{icon: 'v', onClick: () => onApprove(uid)},
						{icon: 'clear', onClick: () => onDecline(uid)}
					]}>
						{request.email}
					</ListItem>
				))}
			</div>
		);
	}

	render(){
		const {className, classes, requests} = this.props;
		const {isOpen} = this.obState;

		if(!requests){
			return null;
		}

		const s = createStyle(style, className, classes);

		const totalRequests = Object.keys(requests).length;

		return (
			<div className={s.root}>
				<div className={s.header} onClick={() => this.obState.isOpen = !isOpen}>
					<Icon className={s.headerIcon} type='user'/>
					<span className={s.headerTitle}>{totalRequests} User request{totalRequests > 1?'s':''}</span>
					<Icon type='play' className={s.toggleButton}/>
				</div>
				{isOpen && this.renderRequests()}

			</div>
		);
	}
}