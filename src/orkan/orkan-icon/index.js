import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

export default class OrkanIcon extends Component {
    static propTypes = {
        small: PropTypes.bool,
        medium: PropTypes.bool,
        large: PropTypes.bool,
        huge: PropTypes.bool
    };

    render() {
        var {className, type, small, medium, large, huge, ...otherProps} = this.props;

        className = classNames('OrkanIcon', className, 'OrkanIcon-' + type, {
            'OrkanIcon-small': small,
            'OrkanIcon-medium': medium,
            'OrkanIcon-large': large,
            'OrkanIcon-huge': huge
        });

        return (
            <span {...otherProps} className={className}></span>
        );
    }
}
