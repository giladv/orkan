import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import OrkanSpinner from '../orkan-spinner';

import './style';
import {formSubmit} from '../form';

@observer
export default class Button extends Component{
	static propTypes = {
		tooltip: PropTypes.string,
		primary: PropTypes.bool,
		important: PropTypes.bool,
		secondary: PropTypes.bool,
		square: PropTypes.bool,
		isBusy: PropTypes.bool,
		disabled: PropTypes.bool,
	};

	static defaultProps = {
	};

	@autobind
	clickHandler(e){
		const {onClick} = this.props;

		onClick && onClick(e);
	}



	render(){
		const {className, primary, secondary, important, square, isBusy, disabled, tooltip, ...otherProps} = this.props;

		const newClassName = classNames('Button', className, {
			'Button-medium': true,
			'Button-primary': primary,
			'Button-secondary': secondary,
			'Button-important': important,
			'Button-disabled': disabled,
			'Button-square': square
		});

		const labelClassName = classNames('Button-label', {
			'Button-label-hidden': isBusy
		});

		const spinnerClassName = classNames('Button-spinner', {
			'Button-spinner-hidden': !isBusy
		});

		return (
			<a {...otherProps} className={newClassName} onClick={this.clickHandler} tabIndex="0">
				<OrkanSpinner className={spinnerClassName} size={2}/>
				<div className={labelClassName}>{this.props.children}</div>
			</a>
		);
	}
}

export const SubmitButton = formSubmit(Button);







//
// @observer
// export class PromiseButton extends Component{
// 	@observable state = {
// 		isBusy: false
// 	};
//
// 	@autobind
// 	clickHandler(e){
// 		var {onClick} = this.props;
//
// 		if(onClick){
// 			var promise = onClick();
// 			if(promise && promise.then){
// 				this.state.isBusy = true;
// 				promise.then(() => this.state.isBusy = false)
// 					.catch(() => this.state.isBusy = false);
// 			}
// 		}
//
// 	}
//
// 	render(){
// 		var {className, ...otherProps} = this.props;
// 		var {isBusy} = this.state;
//
// 		var className = classNames('PromiseButton', className);
//
// 		return (
// 			<Button {...otherProps} isBusy={isBusy} className={className} onClick={this.clickHandler} />
// 		);
// 	}
// }