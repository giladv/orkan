import {toJS, ObservableMap, action, isObservableMap, isObservableArray, isObservableObject, observable} from 'mobx';
import {isNumber, isPlainObject, isArray, forEach, isObject} from 'lodash';

const KEY_SPLIT_REGEX = /\.|\[|\]\.|\]/;

export class ObservableNestedMap{
	map = new ObservableMap({});

	constructor(value){
		this.merge(value);
	}

	get(key, ctx = this.map){
		var parts = key.split(KEY_SPLIT_REGEX).filter(part => !!part);

		var part = parts.shift();
		var value;

		if(isObservableMap(ctx)){
			value = ctx.get(part);
		}else if(isObservableArray(ctx)){
			value = ctx[part];
		}

		if(parts.length && (isObservableMap(value) || isObservableArray(value))){
			return this.get(parts.join('.'), value);
		}else{
			return value
		}
	}

	@action shallowSet(ctx, key, value){
		if(isPlainObject(value) || isObservableObject(value)){
			value = nestedMapFromObj(value);
		}else if(isArray(value) || isObservableArray(value)){
			value = nestedMapFromArray(value);
		}

		if(isObservableMap(ctx)){
			ctx.set(key, value);
		}else if(isObservableArray(ctx)){
			ctx[key] = value;
		}
	}

	@action set(key, value, ctx = this.map){
		var parts = key.split(KEY_SPLIT_REGEX).filter(part => !!part);
		var part = parts.shift();

		if(!parts.length){
			return this.shallowSet(ctx, part, value);
		}

		var obj = this.get(part, ctx);
		if(!obj){
			if(isNaN(parts[0])){
				this.shallowSet(ctx, part, new ObservableMap({}));
			}else{
				this.shallowSet(ctx, part, []);
			}
		}
		obj = this.get(part, ctx);
		return this.set(parts.join('.'), value, obj);
	}

	@action merge(value){
		this.map.merge(nestedMapFromObj(value));
	}

	@action clear(){
		this.map.clear();
	}

	toJS(){
		return toJS(this.map);
	}
}


function nestedMapFromObj(obj){
	var nestedMap = new ObservableMap(obj);

	nestedMap.forEach((value, key) => {
		if(isPlainObject(value) || isObservableObject(value)){
			nestedMap.set(key, nestedMapFromObj(value));
		}else if(isArray(value) || isObservableArray(value)){
			nestedMap.set(key, nestedMapFromArray(value));
		}else if(isObject(value) && !isPlainObject(value)){
			nestedMap.set(key, value);
		}
	});

	return nestedMap;
}

function nestedMapFromArray(arr){
	return arr.map(value => {
		if(isPlainObject(value) || isObservableObject(value)){
			return nestedMapFromObj(value);
		}else if(isArray(value) || isObservableArray(value)){
			return nestedMapFromArray(value);
		}else if(isObject(value) && !isPlainObject(value)){
			return observable.ref(value);
		}else{
			return value;
		}
	});
}