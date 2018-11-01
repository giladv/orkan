import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import map from 'lodash/map';

import {formInput} from '../../form';
import orkanInject from '../../orkan-inject';
import Select from '../select';


@orkanInject(({optionsPath}) => {
	return {
		data: optionsPath
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
			label: optionsLabel === '$key'?key:item[optionsLabel],
			value: optionsValue === '$key'?key:item[optionsValue]
		}));


		return (
			<Select {...otherProps} options={options} disabled={!data}/>
		);
	}
}


export const DynamicSelectControl = formInput()(DynamicSelect);
