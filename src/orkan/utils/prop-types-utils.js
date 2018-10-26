import PropTypes from 'prop-types';

export const typeOrFalse = type => PropTypes.oneOfType([PropTypes.oneOf([false]), type]);
