import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import DevTools from 'mobx-react-devtools';
import {withRouter} from 'react-router';

import s from './style';
import Collection from '../../orkan/collection';
import Img from '../../orkan/img';
import Value from '../../orkan/value';
import WithValue from '../../orkan/with-value';
import Button from '../button';
import CodeBlock from '../code-block';


@withRouter
export default class App extends Component{

	render(){
		const {children} = this.props;

		return (
			<div className={s.root}>
				<header className={s.header}>
					<div className={s.headerCenter}>
						<a className={s.logo}>Orkan<span>.js</span></a>
						<Collection className={s.menu} path='menu' renderItem={(item, i) => <li><a href={item.link}>{item.label}</a></li>}/>
					</div>
				</header>

				<div className={s.hero}>
					<WithValue path='home/hero/background' render={value => <Img className={s.heroImg} mode='cover' src={value}/>}/>

						<h2 className={s.heroTitle}><Value html path='home/hero/title'/></h2>
						<div className={s.heroActions}>
							<WithValue path='home/hero/primaryCta' render={cta =>
								<Button primary href={cta.link}>{cta.label}</Button>
							}/>

							<WithValue path='home/hero/secondaryCta' render={cta =>
								<Button href={cta.link}>{cta.label}</Button>
							}/>
						</div>
				</div>

				<div className={s.features}>
					<div className={s.featuresCenter}>
						<h2 className={s.featuresTitle}><Value path='home/features/title'/></h2>

						<Collection className={s.featuresList} path='home/features/list' limit={10} renderItem={(item, i) =>
							<div key={i} className={s.featureItem}>
								<Img className={s.featureImg} mode='contain' src={item.img}/>
								<div className={s.featureInfo}>
									<h3 className={s.featureTitle}>{item.title}</h3>
									<div className={s.featureBody}>{item.body}</div>
								</div>
							</div>
						}/>
					</div>
				</div>

				<div className={s.examples}>
					<div className={s.examplesCenter}>
						<h2 className={s.examplesTitle}><Value path='home/examples/title'/></h2>

						<Collection className={s.examplesList} path='home/examples/list' limit={10} renderItem={(item, i) =>
							<div key={i} className={s.exampleItem}>
								<div className={s.exampleInfo}>
									<h3 className={s.exampleTitle}>{item.title}</h3>
									<div className={s.exampleBody}>{item.body}</div>
									<a className={s.exampleLink} href={item.learnMoreLink}>Learn more</a>
								</div>
								<CodeBlock className={s.exampleCode}>{item.code}</CodeBlock>
							</div>
						}/>
					</div>
				</div>


				<div className={s.promo}>
					<WithValue path='home/promo/background' render={value => <Img className={s.heroImg} mode='cover' src={value}/>}/>

					<h2 className={s.promoTitle}><Value path='home/promo/title'/></h2>

					<WithValue path='home/promo/cta' render={cta =>
						<Button primary className={s.promoCta} href={cta.link}>{cta.label}</Button>
					}/>
				</div>

				<footer className={s.footer}>
					<div className={s.footerCenter}>
						<a className={s.footerLogo}>Orkan<span>.js</span></a>
						<Collection className={s.footerMenu} path='menu' renderItem={(item, i) => <li><a href={item.link}>{item.label}</a></li>}/>
					</div>
				</footer>
			</div>
		);
	}
}



