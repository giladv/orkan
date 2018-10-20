import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import './style';

@observer
export default class Img extends Component {
    static propTypes = {
        src: PropTypes.string,
        alt: PropTypes.string,
        mode: PropTypes.oneOf(['cover', 'contain']),
        align: PropTypes.string,
        onLoad: PropTypes.func,
		onError: PropTypes.func,
        simple: PropTypes.bool
    };

    static defaultProps = {
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
        const {className, simple, src, alt, mode, align, ...otherProps} = this.props;
        const {isLoading} = this.state;

        const newClassName = classNames('Img', className, {
            'Img-cover': mode === 'cover',
			'Img-contain': mode === 'contain',
            'Img-loaded': !isLoading
        });


		if(simple){
            return (
                <img {...otherProps} src={src} crossOrigin="anonymous" className={newClassName} alt={alt}/>
            );
		}else{
			const style = {
			    backgroundImage: `url(${src})`,
                backgroundPosition: align
			};
			return (
                <div {...otherProps} className={newClassName}>
                    <div alt={alt} style={style}/>
                </div>
            );
        }
    }
}


