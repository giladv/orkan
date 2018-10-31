import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './style.scss';
import icons from './icons.css';
console.log(icons)
import {createStyle} from '../utils/style-utils';

export default class OrkanIcon extends Component {
    static propTypes = {
		type: PropTypes.string.isRequired
    };

    render() {
        const {className, type, ...otherProps} = this.props;
        const s = createStyle(style, className, icons.icon, icons['icon-' + type]);

        return (
            <span {...otherProps} className={s.root}></span>
        );
    }
}
