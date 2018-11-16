import React, { Component } from 'react';
import {withRouter} from 'react-router';
import {observer} from 'mobx-react';
import WithValue from '../../orkan/with-value';

import {createStyle} from '../../utils/style-utils';

import style from './style';

@withRouter
@observer
export default class DocPage extends Component{

	render(){
		const {className, params} = this.props;

		const s = createStyle(style, className);

		return (
			<WithValue path={`docs/${params.pageId}`} render={page =>
				<div className={s.root}>
					<h2>{page.title}</h2>
					<div dangerouslySetInnerHTML={{__html: page.body}}/>
				</div>
			}/>
		);
	}
}



