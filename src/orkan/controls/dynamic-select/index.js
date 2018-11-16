import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import map from 'lodash/map';

import {formInput} from '../../form';
import inject from '../../inject';
import {stripRootFromPath} from '../../utils/path-utils';
import Select from '../select';


@inject(({optionsPath}) => {
	return {
		data: optionsPath && stripRootFromPath(optionsPath)
	};
})
@observer
export class DynamicSelect extends Component {

	static propTypes = {
		...Select.propTypes,
		optionsPath: PropTypes.string.isRequired,
		optionsLabel: PropTypes.string.isRequired,
		optionsValue: PropTypes.string.isRequired,
	};

	static defaultProps = {
	};

	render(){
		const {data, optionsLabel, optionsValue, ...otherProps} = this.props;


		const options = !data?[]:map(data, (item, key) => ({
			label: getWithFlags(key, item, optionsLabel),
			value: getWithFlags(key, item, optionsValue)
		}));


		return (
			<Select {...otherProps} options={options} disabled={!data}/>
		);
	}
}


export const DynamicSelectControl = formInput()(DynamicSelect);


const getWithFlags = (key, value, keyWithFlags) => {
	switch(keyWithFlags){
		case '$key':
			return key;
		case '$value':
			return value;
		default:
			return value[keyWithFlags];
	}
};