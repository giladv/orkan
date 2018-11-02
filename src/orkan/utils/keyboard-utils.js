window.__VERSION__ = 0
import HumanInput from 'humaninput/lib/humaninput';
export class Keyboard{
	constructor(){
		this.binder = new HumanInput(window);
		// this.binder.filter = e => true
	}

	bind(keys, handler){
		this.binder.on(keys, handler);
	}

	unbind(keys, handler){
		this.binder.off(keys, handler);
	}

	isDown(keys){
		return this.binder.state.down.indexOf(keys) > -1 && this.binder.state.down.length === 1;
	}


}

export const keyboard = new Keyboard();

export const onDoublePress = (key, handler) => {

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

	keyboard.bind(key, singleHandler);

	return () => keyboard.unbind(key, singleHandler);
};