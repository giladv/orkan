import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import mapValues from 'lodash/mapValues';
import values from 'lodash/values';

import {REACT_CONTEXT_NAME} from './constants';


export default function inject(mapPathsToProps = () => ({}), config) {
	const options = {
		liveEditedData: true,
		...config
	};
	return (DecoratedComponent) => {
		@observer
		class injector extends Component {
			static propTypes = {
				...(DecoratedComponent.propTypes || {})
			};
			static contextTypes = {
				[REACT_CONTEXT_NAME]: PropTypes.object
			};

			static decoratedComponent = DecoratedComponent;

			componentWillMount(){
				const {store} = this.getContext();

				const paths = values(mapPathsToProps(this.props)).filter(it => !!it);
				this.disposables = paths.map(path => store.listen(path));
			}

			componentWillUnmount(){
				this.disposables.forEach(dispose => dispose());
			}


			getContext() {
				return this.context[REACT_CONTEXT_NAME];
			}



			render() {
				const {store} = this.getContext();
				const {injectedProps = []} = this.props;
				let mappedPaths;
				let mappedValues = {};
				let mappedStatuses = {};
				try {
					const {getValue} = this.getContext();
					mappedPaths = mapPathsToProps(this.props);
					mappedValues = mapValues(mappedPaths, path => {
						if(!path){
							return;
						}

						return options.liveEditedData?getValue(path):store.getValue(path)
					});
					mappedStatuses = mapValues(mappedPaths, path => store.isPathLoading(path))
				} catch (err) {
					//React 14+ reports the error in "inject" with a wrong stack trace. It will write something about
					//failing to reconcile a different component that was already unmounted.
					// so we catch the error report it and rethrow here we still have the actual stack trace.
					console.error(err);
					throw err;
				}


				return (
					<DecoratedComponent
						{...this.props}
						{...mappedValues}
						isPathLoading={mappedStatuses}
						injectedProps={[...injectedProps, ...Object.keys(mappedPaths)]}
						orkan={this.getContext()}/>
				);



			}
		}

		return injector;
	}
}

inject.propTypes = {
	mapPropsToPaths: PropTypes.func,
	options: PropTypes.shape({
		liveEditedData: PropTypes.bool
	})
};

inject.defaultProps = {
	options: {
		liveEditedData: true
	}
};