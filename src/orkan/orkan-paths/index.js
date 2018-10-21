import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import OrkanHeader from '../orkan-header';
import Input from '../controls/input';
import orkanInject from '../orkan-inject';
import OrkanListItem from '../orkan-list-item';

import './style.scss';

@orkanInject(({path}) => {
	return path?{value: path}:{};

}, {liveEditedData: false})
@observer
export default class OrkanPaths extends Component{

	static propTypes = {
		keys: PropTypes.arrayOf(PropTypes.string).isRequired,
		onCreate: PropTypes.func,
		onSelect: PropTypes.func,
		onRemove: PropTypes.func,
		showHeader: PropTypes.bool,
		path: PropTypes.string
	};

	static defaultProps = {
		onSelect: () => null,
		onCreate: () => null,
		onRemove: () => null,
	};

	@observable obState = {
		newKey: ''
	};

	@autobind
	handleCreate(newKey){
		this.props.onCreate(newKey);
		this.obState.newKey = '';
	}

	@autobind
	handleRemove(e, key){
		this.props.onRemove(key);
		e.stopPropagation();
	}

	render(){
		const {onSelect, keys, showHeader, onCreate, onRemove} = this.props;
		const {newKey} = this.obState;

		if(!keys.length){
			return null;
		}

		return (
			<div className='OrkanPaths'>
				{showHeader &&
					<OrkanHeader title='Other Paths'/>
				}
				{onCreate &&
					<OrkanHeader title={<Input placeholder='key (optional)' value={newKey} onChange={value => this.obState.newKey = value}/>} onCreate={() => this.handleCreate(newKey)}/>
				}
				{keys.map(key => (
					<OrkanListItem key={key} onClick={() => onSelect(key)} buttons={[
						onRemove && {icon: 'trash', onClick: (e) => this.handleRemove(e, key)}
					]}>/{key}</OrkanListItem>
				))}
			</div>
		);
	}
}