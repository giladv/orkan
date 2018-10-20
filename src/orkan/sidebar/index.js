import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import Drag from '../utils/drag';

import './style';

@autobind
export default class Sidebar extends Component {

	static propTypes = {
		isVisible: PropTypes.bool,
		side: PropTypes.oneOf(['right', 'left', 'bottom']),
		initialSize: PropTypes.number,
		onResize: PropTypes.func,
		onResizeStart: PropTypes.func,
		onResizeEnd: PropTypes.func,
	};

	static defaultProps = {
		side: 'left',
		initialSize: 200,
		onResize: () => null,
		onResizeStart: () => null,
		onResizeEnd: () => null
	};

	constructor(props){

		super(props);

		this.state = {
			size: props.initialSize
		};

		this.resizeDrag = new Drag({
			onStart: props.onResizeStart,
			onMove: this.handleResize,
			onEnd: props.onResizeEnd
		});

		this.props.onResize(props.initialSize);
	}


	handleResize(e, dragInfo){
		const {side} = this.props;
		const {size} = this.state;
		let change;
		switch(side){
			case 'left':
				change = dragInfo.pointerChange.x;
				break;
			case 'right':
				change = -dragInfo.pointerChange.x;
				break;
			case 'bottom':
				change = -dragInfo.pointerChange.y;
				break;
			case 'top':
				change = dragInfo.pointerChange.y;
				break;

		}

		this.setState({size: size + change});
		this.props.onResize(size+change);
	}

	handleHandleMouseDown(e){
		this.resizeDrag.start(e, this.refs.handle);
		e.stopPropagation();
	}

	render(){
		const {className, side, initialSize, children, ...otherProps} = this.props;
		const {size} = this.state;

		const newClassName = classNames('Sidebar', className, {
			'Sidebar-left': side === 'left',
			'Sidebar-right': side === 'right',
			'Sidebar-bottom': side === 'bottom'
		});

		return (
			<div {...otherProps} className={newClassName} style={{flexBasis: size}}
				 onMouseDown={e => e.stopPropagation()}>
				<div className="Sidebar-resize-handle" ref="handle" onMouseDown={this.handleHandleMouseDown}></div>
				<div className="Sidebar-content" style={{width: size}}>{children}</div>
			</div>
		);
	}

}
