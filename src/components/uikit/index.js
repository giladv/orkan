import React, { Component } from 'react';
import {withRouter} from 'react-router';
import {observer} from 'mobx-react';
import cx from 'classnames';
import Input from '../../orkan/controls/input';
import Select from '../../orkan/controls/select';
import Switch from '../../orkan/controls/switch';
import Textarea from '../../orkan/controls/textarea';
import Wysiwyg from '../../orkan/controls/wysiwyg';

import {createStyle} from '../../utils/style-utils';

import style from './style';

@withRouter
@observer
export default class Uikit extends Component{

	render(){
		const {children, className} = this.props;

		const s = createStyle(style, className);

		return (
			<div className={s.root}>
				<div className={s.colors}>
					<div className={cx(s.color, s.grey)}/>
					<div className={cx(s.color, s.grey_1)}/>
					<div className={cx(s.color, s.grey_2)}/>
					<div className={cx(s.color, s.grey_3)}/>
					<div className={cx(s.color, s.grey_4)}/>
					<div className={cx(s.color, s.grey_5)}/>
					<div className={cx(s.color, s.grey_6)}/>
				</div>
				<div className={s.colors}>
					<Input value='hello world'/>
				</div>
				<div className={s.colors}>
					<Textarea value='hello world'/>
				</div>
				<div className={s.colors}>
					<Wysiwyg value='hello world'/>
				</div>
				<div className={s.colors}>
					<Switch />
					<Switch value={true}/>
				</div>

				<div className={s.colors}>
					<Switch />
					<Switch value={true}/>
				</div>

				<div className={s.colors}>
					<Select options={[{label: 'Option1'}, {label: 'Option2'}]}/>
				</div>
			</div>
		);
	}
}



