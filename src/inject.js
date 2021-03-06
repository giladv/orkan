import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import mapValues from 'lodash/mapValues';
import values from 'lodash/values';
import omitBy from 'lodash/omitBy';
import shallowCompare from 'react-addons-shallow-compare';

import {serializeQuery} from './firestore';

const isNode = new Function("try {return this===global;}catch(e){return false;}");
/**
 * A react component decorator, returns a new component with the requested data injected as props
 * @param {function} [mapPropsToPaths]  - a function which receives the props as arguments and returns an object of required resources to load.
 * ```props => ({injectAs: pathStr | {path, [where], [orderBy], ..} }```
 * @param {object} [config] - a config object. supports: liveEditedData[bool]
 * @returns {ReactComponent} a new higher order component
 * */
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
				OrkanContext: PropTypes.object
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

			componentWillReact(){
				const newDisposables = this.listenToPaths(this.props);
				this.disposeAllListeners();
				this.disposables = newDisposables;
			}

			componentWillUnmount(){
				this.disposeAllListeners();
			}

			getContext() {
				return this.context.OrkanContext;
			}

			disposeAllListeners(){
				this.disposables.forEach(dispose => dispose());
			}

			listenToPaths(props){
				const {store} = this.getContext();

				const mappedQueries = values(mapPropsToPaths(props)).filter(it => !!it);
				return mappedQueries.map(query => {
					const {path, pathOptions} = parseQuery(query);
					if(isNode()){
						store.load(path, pathOptions);
						return () => null;
					}else{
						return store.listen(path, pathOptions);
					}
				});
			}

			getValue(path, pathOptions){
				const {store, getLiveValue, isAdminOpen} = this.getContext();
				return options.liveEditedData && isAdminOpen()
					?getLiveValue(path, pathOptions)
					:store.getValue(path, pathOptions);
			}

			render() {
				const {store} = this.getContext();
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
						return store.isLoading(serializeQuery(path, pathOptions));
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

const parseQuery = query => {
	if(typeof query === 'string'){
		return {path: query};
	}else{
		let pathOptions = omitBy(query, (value, key) => key === 'path' || !value);
		pathOptions = Object.keys(pathOptions).length?pathOptions:undefined;
		return {path: query.path, pathOptions};
	}
};