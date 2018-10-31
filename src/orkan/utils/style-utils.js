import classNames from 'classnames';
import assignWith from 'lodash/assignWith';
import mapValues from 'lodash/mapValues';
import mapKeys from 'lodash/mapKeys';



export const createStyle2 = (className, classes, style, flags) => {
	const customizer = (val1, val2) => classNames(val1, val2);

	const createFlags = flags => mapValues(flags, value =>
		classNames(mapKeys(value, (value, key) => style[key]))
	);

	return assignWith(
		{root: className},
		style,
		classes,
		createFlags(flags),
		customizer
	);
};


export const createStyle = (style, ...overrides) => {
	const customizer = (val1, val2) => classNames(val1, val2);

	const createFlags = flags => classNames(mapKeys(flags, (value, key) => style[key]));

	return assignWith(
		{},
		style,
		...overrides.map(override => {
			if(typeof override === 'string'){
				return {root: override}
			}else if(typeof override === 'object'){
				return mapValues(override, (value) => {
					if(typeof value === 'string'){
						return value;
					}else{
						return createFlags(value);
					}
				})
			}

		}),
		customizer
	);
};