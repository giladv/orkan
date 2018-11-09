import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import mapValues from 'lodash/mapValues';
import values from 'lodash/values';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';
import shallowCompare from 'react-addons-shallow-compare';

import {REACT_CONTEXT_NAME} from './constants';


export default function inject(mapPropsToPaths = () => ({}), config) {
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
			disposables = [];

			componentWillMount(){
				this.disposables = this.listenToPaths(this.props);
			}

			componentWillReceiveProps(nextProps, nextState){
				if(shallowCompare(this, nextProps, nextState)){
					const newDisposables = this.listenToPaths(nextProps);
					this.disposeAllListeners();
					this.disposables = newDisposables;
				}
			}

			componentWillUnmount(){
				this.disposeAllListeners();
			}

			getContext() {
				return this.context[REACT_CONTEXT_NAME];
			}

			disposeAllListeners(){
				this.disposables.forEach(dispose => dispose());
			}

			listenToPaths(props){
				const {store} = this.getContext();

				const paths = values(mapPropsToPaths(props)).filter(it => !!it);
				return paths.map((pathQuery) => {
					if(typeof pathQuery === 'object'){
						const {path, ...queryOptions} = pathQuery;
						const sanitizedOptions = pickBy(queryOptions, value => typeof value === 'string' && value.length);
						return store.listenToCollection(path, sanitizedOptions);
					}else{
						return store.listen(pathQuery)
					}
				});
			}

			render() {
				const {store, getValue} = this.getContext();
				const {injectedProps = []} = this.props;
				let mappedPaths;
				let mappedValues = {};
				let mappedStatuses = {};
				try {
					mappedPaths = mapPropsToPaths(this.props);
					mappedValues = mapValues(mappedPaths, pathQuery => {
						if(!pathQuery){
							return;
						}

						if(typeof pathQuery === 'string'){
							pathQuery = {path: pathQuery};
						}

						const {path, ...queryOptions} = pathQuery;
						let sanitizedOptions = pickBy(queryOptions, option => !!option);
						sanitizedOptions = isEmpty(sanitizedOptions)?null:sanitizedOptions;
						return options.liveEditedData
							?getValue(path, sanitizedOptions)
							:store.getValue(path, sanitizedOptions);
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

// for documentation purposes only
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


