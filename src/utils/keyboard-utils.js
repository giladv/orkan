// do not use these packages
// humaninput, keyboardjs - does not support server
// ComboKeys, mousetrap - does not support multiple listeners to same key

import {toKeyName} from 'is-hotkey'

export class Keyboard{
	downKeys = [];

	constructor(context){
		this.context = context;

		this.bind('keydown', null, e => this.handleNativeEvent(e));
		this.bind('keyup', null, e => this.handleNativeEvent(e));

		document.body.onblur = () => this.downKeys = [];
	}

	handleNativeEvent(e){
		const sanitizedKey = toKeyName(e.key);

		if(e.repeat){
			return;
		}

		this.downKeys = this.downKeys.filter(key => key !== sanitizedKey);

		if(e.type === 'keydown'){
			this.downKeys.push(sanitizedKey);
		}
	}

	bind(event, key, handle){

		const handleBase = e => {
			const sanitizedKey = toKeyName(e.key);
			if((key === null || key === sanitizedKey) && !e.repeat){
				handle(e);
			}
		};

		this.context.addEventListener(event, handleBase);

		return () => this.context.removeEventListener(event, handleBase);
	}

	onKeyDown(key, handler){
		return this.bind('keydown', key, handler);
	}

	onKeyUp(key, handler){
		return this.bind('keyup', key, handler);
	}

	onKeyPress(key, handler){
		return this.bind('keypress', key, handler);
	}

	onDoublePress(key, handler){

		let count = 0;
		let timeout;

		const singleHandler = e => {
			if(e.key.toLowerCase() !== key){
				return;
			}
			count++;
			timeout && clearTimeout(timeout);
			if(count === 2){
				handler(e);
				count = 0;
			}else{
				timeout = setTimeout(() => count = 0, 300);
			}
		};

		return this.onKeyPress(key, singleHandler);
	};

	onKeyHold(key, timeMs, handler){
		let timeout;
		const killKeyDown = this.onKeyDown(key, () => {
			timeout = setTimeout(() => {
				handler();
			}, timeMs);
		});

		const killKeyUp = this.onKeyUp(key, () => {
			clearTimeout(timeout);
		});

		return () => {
			killKeyDown();
			killKeyUp();
			clearTimeout(timeout);
		};
	}

	isDown(key){
		return this.downKeys.indexOf(key) > -1;
	}
}