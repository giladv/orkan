import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from './style';
import {createStyle} from '../utils/style-utils';

@observer
export default class Img extends Component {
    static propTypes = {
        src: PropTypes.string,
        ratio: PropTypes.number,
        alt: PropTypes.string,
        mode: PropTypes.oneOf(['cover', 'contain']),
        align: PropTypes.string,
        onLoad: PropTypes.func,
		onError: PropTypes.func,
        simple: PropTypes.bool
    };

    static defaultProps = {
        ratio: 0,
        mode: 'contain',
        align: 'center center',
        onLoad: () => null,
		onError: ()=>null
    };

    @observable state = {
        isLoading: true
    };


    componentWillReceiveProps(nextProps) {
        var {src} = this.props;
        if (nextProps.src !== src) {
            this.updateImage(nextProps);
        }
    }

    componentDidMount() {
        this.updateImage(this.props);
    }

    updateImage({src, onLoad, onError}) {
        this.loadImage(src)
            .then(image => {
				this.state.isLoading = false;
                !this.isUnmounted && onLoad(image);
            })
            .catch(err => {
                this.state.isLoading = false;
                !this.isUnmounted && onError(err)
			});
    }


    componentWillUnmount() {
        this.isUnmounted = true;
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.addEventListener('load', () => resolve(image));
			if(src){
				image.addEventListener('error', err => reject(err));
			}
            image.src = src;
        });
    }

    render() {
        const {className, classes, simple, src, alt, mode, align, ratio, ...otherProps} = this.props;
        const {isLoading} = this.state;

        const s = createStyle(style, className, classes, {
            root: {
                cover: mode === 'cover',
                contain: mode === 'contain',
                loaded: !isLoading
            }
        });

		if(simple){
            return (
                <img {...otherProps} src={src} crossOrigin="anonymous" className={s.root} alt={alt}/>
            );
		}else{
			const style = {
			    backgroundImage: `url(${src})`,
                backgroundPosition: align
			};
			return (
                <div {...otherProps} className={s.root} style={{paddingTop: ratio + '%'}}>
                    <div alt={alt} style={style} className={s.backgroundContainer}/>
                </div>
            );
        }
    }
}


