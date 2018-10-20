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
				{children}

				<div className="hero">
					<WithValue path='home/hero/background' render={value => <Img mode='cover' src={value}/>}/>

					<h2><Value path='home/hero/title'/></h2>

					<WithValue path='home/hero/cta' render={cta => (
						<a href={cta.link}>{cta.label}</a>
					)}/>
				</div>
				<h2>Blog</h2>
				<Collection path='blog/posts' limit={10} renderItem={(post, i) =>
					<div key={i}>
						<h3>{post.title}</h3>
						<p>{post.body}</p>
					</div>
				}/>

			</div>
		);
	}
}