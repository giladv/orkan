import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import {Link, withRouter} from 'react-router';
import {observable} from 'mobx';
import {observer} from 'mobx-react';

import Collection from '../../orkan/collection';
import {createStyle} from '../../utils/style-utils';
import PageHeader from '../page-header';

import style from './style';

@withRouter
@observer
export default class Docs extends Component{

	render(){
		const {className, children} = this.props;

		const s = createStyle(style, className, {
		});
		return (
			<div className={s.root}>
				<PageHeader className={s.header} basePath='docs'/>
				<div className={s.columnsContainer}>
					<div className={s.sidebar}>
						<Collection className={s.pages} path='docs/pages' renderItem={(page, i) => <Link activeClassName={s.activeLink} to={'/docs/' + i}>{page.title}</Link>}/>
						<div className={s.sidebarHeader}>API</div>
						<Link activeClassName={s.activeLink} to='docs/api/Provider'>Provider</Link>
						<Link activeClassName={s.activeLink} to='docs/api/Value'>Value</Link>
						<Link activeClassName={s.activeLink} to='docs/api/WithValue'>WithValue</Link>
						<Link activeClassName={s.activeLink} to='docs/api/Collection'>Collection</Link>
						<Link activeClassName={s.activeLink} to='docs/api/inject'>inject</Link>
					</div>
					<div className={s.content}>
						{children}
					</div>
				</div>
			</div>
		);
	}
}



