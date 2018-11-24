import Popper from 'popper.js';
import React, {cloneElement, Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';

import style from './style.scss';
import bubbleStyle from './bubble-style.scss';

import {createStyle} from '../utils/style-utils';

@observer
export default class Tooltip extends Component {
    static propTypes = {
        content: PropTypes.node,
		position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
		disabled: PropTypes.bool,
		trigger: PropTypes.oneOf(['hover', 'focus'])
    };

    static defaultProps = {
    	position: 'top',
		trigger: 'hover'
	};

    @observable obState = {
        isOpen: false,
		finalPosition: this.props.position,
		tooltipStyle: {},
		tipStyle: {}
    };

    @autobind
	handleMouseOver(e){
        this.obState.isOpen = true;
    }

    @autobind
	handleMouseLeave(e){
		this.obState.isOpen = false;
	}

    @autobind
	handleTooltipRef(tooltipRef){
    	if(tooltipRef){
    		this.initPopper(ReactDOM.findDOMNode(tooltipRef), this.tipElem);
		}else{
			this.destroyPopper();
		}
	}


	initPopper(tooltipElem, tipElem){
		const {position} = this.props;

		this.popper = new Popper(this.elem, tooltipElem, {
			placement: position,
			modifiers: {
				applyStyle: {enabled: false},
				applyReactStyle: {
					enabled: true,
					fn: this.handleStylesUpdate,
					order: 900,
				},
				arrow: {
					element: tipElem,
				},
				preventOverflow: {
					boundariesElement: 'viewport'
				}
			}
		});
	}

	destroyPopper(){
		this.popper && this.popper.destroy();
		this.popper = null;
	}

	@autobind
	handleStylesUpdate({placement, styles, arrowStyles}){
		this.obState.finalPosition = placement;
		this.obState.tooltipStyle = styles;
		this.obState.tipStyle = arrowStyles;
	}

    render() {
        const {className, children, content, trigger, disabled} = this.props;
        const {isOpen, tooltipStyle, finalPosition, tipStyle} = this.obState;

        const s = createStyle(style, className, children.props.className);

        let triggerProps = {};

        if(trigger === 'hover'){
			triggerProps = {
				onMouseOver: this.handleMouseOver,
				onMouseLeave: this.handleMouseLeave,
			};
		}else if(trigger === 'focus'){
			triggerProps = {
				onFocus: this.handleMouseOver,
				onBlur: this.handleMouseLeave,
			};
		}else{
        	throw new Error('No valid trigger type supplied "' + trigger + '"');
		}

        return [
            cloneElement(children, {
            	className: s.root,
				ref: ref => this.elem = ReactDOM.findDOMNode(ref),
				...triggerProps
            }),
            isOpen && !disabled && ReactDOM.createPortal(
				<Bubble style={tooltipStyle} tipStyle={tipStyle} className={s.tooltip} position={finalPosition} ref={this.handleTooltipRef} tipRef={ref => this.tipElem = ref}>{content}</Bubble>,
				document.body
			)
        ];
    }
}


@observer
class Bubble extends Component{
	static propTypes = {
		position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
		tipRef: PropTypes.func,
		tipStyle: PropTypes.object
	};

	render(){
		const {className, children, position, tipRef, tipStyle, ...otherProps} = this.props;

		const s = createStyle(bubbleStyle, className, {root: {[position]: true}});

		return (
			<div {...otherProps} className={s.root}>
				{children}
				<div className={s.tip} ref={tipRef} style={tipStyle}/>
			</div>
		);
	}
}