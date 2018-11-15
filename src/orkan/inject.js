import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import mapValues from 'lodash/mapValues';
import values from 'lodash/values';
import omitBy from 'lodash/omitBy';
import omit from 'lodash/omit';
import shallowCompare from 'react-addons-shallow-compare';

import {REACT_CONTEXT_NAME} from './constants';
import {serializeQuery} from './firestore';


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

				const mappedQueries = values(mapPropsToPaths(props)).filter(it => !!it);
				return mappedQueries.map(query => {
					const {path, pathOptions} = parseQuery(query);
					return store.listen(path, pathOptions);
				});
			}

			getValue(path, pathOptions){
				const {store, getValue} = this.getContext();
				return options.liveEditedData
					?getValue(path, pathOptions)
					:store.getValue(path, pathOptions);
			}

			render() {
				const {store, getValue} = this.getContext();
				const {injectedProps = []} = this.props;
				let mappedQueries;
				let mappedValues = {};
				let mappedStatuses = {};
				try {
					mappedQueries = mapPropsToPaths(this.props);
					mappedQueries = omitBy(mappedQueries, value => !value);

					mappedValues = mapValues(mappedQueries, query => {
						const {path, pathOptions} = parseQuery(query);
						return this.getValue(path, pathOptions);
					});

					mappedStatuses = mapValues(mappedQueries, query => {
						const {path, pathOptions} = parseQuery(query);
						store.isLoading(serializeQuery(path, pathOptions));
					});
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
						injectedProps={[...injectedProps, ...Object.keys(mappedQueries)]}
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


const parseQuery = query => {
	if(typeof query === 'string'){
		return {path: query};
	}else{
		let pathOptions = omit(query, (value, key) => key === 'path' || !value);
		pathOptions = Object.keys(pathOptions).length?pathOptions:null;
		return {path: query.path, pathOptions};
	}
};