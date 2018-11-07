import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import {Link, withRouter} from 'react-router';
import {observable} from 'mobx';
import {observer} from 'mobx-react';

import Collection from '../../orkan/collection';
import {createStyle} from '../../utils/style-utils';

import style from './style';

@withRouter
@observer
export default class App extends Component{
	@observable obState = {
		isCompactHeader: window.scrollY >= 120
	};

	componentDidMount(){
		this.scrollContainer.addEventListener('scroll', e => {
			if(this.scrollContainer.scrollTop >= 120){
				this.obState.isCompactHeader = true;
			}else{
				this.obState.isCompactHeader = false;
			}
		})
	}

	handleMenuClick(e, link){
		const {router} = this.props;

		if(link.startsWith('#')){
			const elem = document.getElementsByName(link.slice(1))[0];
			elem && elem.scrollIntoView({
				behavior: 'smooth', // smooth scroll
				block: 'start' // the upper border of the element will be aligned at the top of the visible part of the window of the scrollable area.
			});
		}

		router.push(link);

		e.preventDefault();
	}

	render(){
		const {children, className, router} = this.props;
		const {isCompactHeader} = this.obState;

		const isHomeRoute = router.isActive('/', true);

		const s = createStyle(style, className, {
			header: {
				compactHeader: isCompactHeader || !isHomeRoute
			}
		});

		return (
			<div className={s.root}>
				<header className={s.header}>
					<div className={s.headerCenter}>
						<a onClick={e => this.handleMenuClick(e, '#hero')} href='/#hero' className={s.logo}>Orkan<span>.js</span></a>
						<Collection lightOverlay className={s.menu} path='menu' renderItem={(item, i) =>
							<li key={i}>
								<Link onClick={e => this.handleMenuClick(e, item.link)} to={item.link}>{item.label}</Link>
							</li>
						}/>
					</div>
				</header>

				<div className={s.scrollContainer} ref={ref => this.scrollContainer = ref}>

					{children}

					<footer className={s.footer}>
						<div className={s.footerCenter}>
							<a className={s.footerLogo}>Orkan<span>.js</span></a>
							<Collection className={s.footerMenu} path='menu' renderItem={(item, i) => <li key={i}><a href={item.link}>{item.label}</a></li>}/>
						</div>
					</footer>
				</div>

			</div>
		);
	}
}



