import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import DevTools from 'mobx-react-devtools';
import {withRouter} from 'react-router';

import './style';
import {Collection, Value, WithValue} from '../../orkan';
import Img from '../../orkan/img';

@withRouter
export default class App extends Component{

	render(){
		const {children} = this.props;
		// return null;
		return (
			<div className="App">
				<header>
					<div>
						<a href="#"><span>Holistic</span>Art</a>
					</div>
				</header>
				<div className="hero">
					<WithValue path='home/hero/background' render={value => <Img mode='cover' src={value}/>}/>

						<h2><Value path='home/hero/title'/></h2>

					<WithValue path='home/hero/cta' render={cta => (
						<a href={cta.link}>{cta.label}</a>
					)}/>
				</div>
				<div className='portfolio'>
					<h2>Our Work</h2>

					<Collection path='home/work' limit={10} renderItem={(item, i) =>
						<div key={i}>
							<Img mode='cover' src={item.image}/>
							<div className='info'>
								<h3>{item.title}</h3>
								{item.body}
							</div>
						</div>
					}/>
				</div>

				<div className="team">
					<h2>Our Team</h2>

					<Collection path='home/team' limit={10} renderItem={(item, i) =>
						<div key={i}>
							<Img mode='cover' className='image' src={item.image}/>
							<div className='info'>
								<h3>{item.name}</h3>
								<div>{item.position}</div>
							</div>
						</div>
					}/>
				</div>

				<div className="about">
					<WithValue path='home/about/background' render={value => <Img mode='cover' src={value}/>}/>
					<h2><Value path='home/about/title'/></h2>
					<WithValue path='home/about/content' render={value => <div className='content' dangerouslySetInnerHTML={{__html: value}}/>}/>
				</div>
				<footer>
				</footer>
			</div>
		);
	}
}


