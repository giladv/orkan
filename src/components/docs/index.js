import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import {Link, withRouter} from 'react-router';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import pickBy from 'lodash/pickBy';
import map from 'lodash/map';

import Collection from '../../orkan/collection';
import WithValue from '../../orkan/with-value';
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
						<Collection path='docs/categories' orderBy='priority' renderItem={(category, categoryId) =>
							<div>
								<div className={s.sidebarHeader}>{category.label}</div>
								<Collection path={`docs/categories/${categoryId}/pages`} orderBy='priority' renderItem={(page, pageId) =>
									<Link activeClassName={s.activeLink} to={`/docs/${categoryId}/${pageId}`}>{page.title}</Link>
								}/>
							</div>
						}/>
						<div className={s.sidebarHeader}>API Reference</div>
						<Link activeClassName={s.activeLink} to='docs/api/Provider'>Provider</Link>
						<Link activeClassName={s.activeLink} to='docs/api/Value'>Value</Link>
						<Link activeClassName={s.activeLink} to='docs/api/WithValue'>WithValue</Link>
						<Link activeClassName={s.activeLink} to='docs/api/Collection'>Collection</Link>
						<Link activeClassName={s.activeLink} to='docs/api/inject'>inject</Link>
					</div>
					{/*<WithValue path='docs/pages' render={pages => {*/}
						{/*const general = pickBy(pages, page => page.category === 'general');*/}
						{/*const admin = pickBy(pages, page => page.category === 'admin');*/}

						{/*return (*/}
							{/*<div className={s.sidebar}>*/}
								{/*<div className={s.sidebarHeader}>General</div>*/}
								{/*{map(general, (page, key) => <Link activeClassName={s.activeLink} to={'/docs/' + key}>{page.title}</Link>)}*/}
								{/*<div className={s.sidebarHeader}>Admin Panel</div>*/}
								{/*{map(admin, (page, key) => <Link activeClassName={s.activeLink} to={'/docs/' + key}>{page.title}</Link>)}*/}
								{/*<div className={s.sidebarHeader}>API Reference</div>*/}
								{/*<Link activeClassName={s.activeLink} to='docs/api/Provider'>Provider</Link>*/}
								{/*<Link activeClassName={s.activeLink} to='docs/api/Value'>Value</Link>*/}
								{/*<Link activeClassName={s.activeLink} to='docs/api/WithValue'>WithValue</Link>*/}
								{/*<Link activeClassName={s.activeLink} to='docs/api/Collection'>Collection</Link>*/}
								{/*<Link activeClassName={s.activeLink} to='docs/api/inject'>inject</Link>*/}
							{/*</div>*/}
						{/*);*/}
					{/*}}/>*/}
					<div className={s.content}>
						{children}
					</div>
				</div>
			</div>
		);
	}
}



