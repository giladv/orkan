import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import {Link, withRouter} from 'react-router';
import {observable} from 'mobx';
import {observer} from 'mobx-react';

import Value from '../../orkan/value';
import WithValue from '../../orkan/with-value';
import Button from '../button';
import CodeBlock from '../code-block';
import {createStyle} from '../../utils/style-utils';
import List from '../../orkan/list';
import Img from '../img';

import style from './style';

@withRouter
@observer
export default class Home extends Component{

	render(){
		const {children, className} = this.props;

		const s = createStyle(style, className, {
		});
		return (
			<div className={s.root}>
				<div name="hero" className={s.hero}>
					<WithValue path='objects/home/hero/background' lightOverlay render={value => <Img className={s.heroImg} mode='cover' src={value}/>}/>

						<h2 className={s.heroTitle}><Value html lightOverlay path='objects/home/hero/title'/></h2>
						<div className={s.heroActions}>
							<WithValue path='objects/home/hero/primaryCta' render={cta =>
								<Button primary to={cta.link}>{cta.label}</Button>
							}/>

							<WithValue lightOverlay path='objects/home/hero/secondaryCta' render={cta =>
								<Button className={s.demoButton} to={cta.link}>{cta.label}</Button>
							}/>
						</div>
				</div>
				<div name='features' className={s.features}>
					<div className={s.featuresCenter}>
						<h2 className={s.featuresTitle}><Value path='objects/home/features/title'/></h2>

						<List className={s.featuresList} path='objects/home/features/list' renderItem={(item, i) =>
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

				<div name='examples' className={s.examples}>
					<div className={s.examplesCenter}>
						<h2 className={s.examplesTitle}><Value path='objects/home/examples/title'/></h2>

						<List className={s.examplesList} path='objects/home/examples/list' orderByChild='priority' renderItem={(item, i) =>
							<div key={i} className={s.exampleItem}>
								<div className={s.exampleInfo}>
									<h3 className={s.exampleTitle}>{item.title}</h3>
									<div className={s.exampleBody}>{item.body}</div>
									<Link className={s.exampleLink} to={item.learnMoreLink}>Learn more</Link>
								</div>
								<CodeBlock className={s.exampleCode} value={item.code}/>
							</div>
						}/>
					</div>
				</div>


				<div className={s.promo}>
					<WithValue lightOverlay path='objects/home/promo/background' render={value => <Img className={s.heroImg} mode='cover' src={value}/>}/>

					<h2 className={s.promoTitle}><Value lightOverlay path='objects/home/promo/title'/></h2>

					<WithValue path='objects/home/promo/cta' render={cta =>
						<Button primary className={s.promoCta} to={cta.link}>{cta.label}</Button>
					}/>
				</div>
			</div>
		);
	}
}



