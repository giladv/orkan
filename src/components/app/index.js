import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import DevTools from 'mobx-react-devtools';
import {withRouter} from 'react-router';

import s from './style';
import Collection from '../../orkan/collection';
import Img from '../../orkan/img';
import Value from '../../orkan/value';
import WithValue from '../../orkan/with-value';


@withRouter
export default class App extends Component{

	render(){
		const {children} = this.props;
		// return null;
		return (
			<div className={s.root}>
				<header>
					<div>
						<a href="#"><span>Holistic</span>Art</a>
					</div>
				</header>
				<div className={s.hero}>
					<WithValue path='home/hero/background' render={value => <Img className={s.heroImg} mode='cover' src={value}/>}/>

						<h2><Value path='home/hero/title'/></h2>

					<WithValue path='home/hero/cta' render={cta => (
						<a href={cta.link}>{cta.label}</a>
					)}/>
				</div>
				<div className={s.portfolio}>
					<h2>Our Work</h2>

					<Collection className={s.portfolioList} path='home/work' limit={10} renderItem={(item, i) =>
						<div key={i}>
							<Img className={s.portfolioItemImg} mode='cover' src={item.image}/>
							<div className={s.portfolioItemInfo}>
								<h3>{item.title}</h3>
								{item.body}
							</div>
						</div>
					}/>
				</div>

				<div className={s.team}>
					<h2>Our Team</h2>

					<Collection className={s.teamList} path='home/team' limit={10} renderItem={(item, i) =>
						<div key={i}>
							<Img mode='cover' className={s.teamItemImg} src={item.image}/>
							<div className={s.teamItemInfo}>
								<h3>{item.name}</h3>
								<div>{item.position}</div>
							</div>
						</div>
					}/>
				</div>

				<div className={s.about}>
					<WithValue path='home/about/background' render={value => <Img className={s.aboutBackground} mode='cover' src={value}/>}/>
					<h2><Value path='home/about/title'/></h2>
					<WithValue path='home/about/content' render={value => <div className={s.aboutContent} dangerouslySetInnerHTML={{__html: value}}/>}/>
				</div>
				<footer>
				</footer>
			</div>
		);
	}
}


