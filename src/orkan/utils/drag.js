
export default class Drag{

	constructor(options){

		var defaults = {
			onStart: function(){},
			onMove: function(){},
			onEnd: function(){}
		};

		this.options = { ...defaults, ...options };
		this.framePending = false;

		this.start = this.start.bind(this);
		this.moveDrag = this.moveDrag.bind(this);
		this.stop = this.stop.bind(this);
		this.updateRef = this.updateRef.bind(this);

	}

	start(e, ref, payload){

		var boundingBox = ref.getBoundingClientRect();

		this.payload = payload;

		this.dragInfo = {
			initPointer: {
				x: e.clientX,
				y: e.clientY
			},
			initItemBB: boundingBox,
			itemBB: boundingBox
		};

		window.addEventListener('mousemove', this.moveDrag);
		window.addEventListener('mouseup', this.stop);


	}


	moveDrag(e){

		if(!this.dragInfo.lastPointer){

			this.options.onStart(e, this.dragInfo, this.payload);

			this.dragInfo.lastPointer = {
				x: e.clientX,
				y: e.clientY
			};

			return;
		}

		var { index, initPointer, initItemBB, itemBB, lastPointer } = this.dragInfo;

		var pointerDelta = {
			x: e.clientX - initPointer.x,
			y: e.clientY - initPointer.y
		};

		var pointerChange = {
			x: e.clientX - lastPointer.x,
			y: e.clientY - lastPointer.y
		};

		var dragHelper = {
			x: initItemBB.left + pointerDelta.x,
			y: initItemBB.top + pointerDelta.y
		};

		var dragDelta = {
			x: dragHelper.x - itemBB.left,
			y: dragHelper.y - itemBB.top
		};

		var dragDirection = {
			horizontal: e.clientX > lastPointer.x ? 'right' : 'left',
			vertical: e.clientY > lastPointer.y ? 'down' : 'up'
		};

		var lastPointer = {
			x: e.clientX,
			y: e.clientY
		};

		Object.assign(this.dragInfo, { pointerDelta, dragHelper, dragDelta, dragDirection, lastPointer, pointerChange });

		this.options.onMove(e, this.dragInfo, this.payload);
	}

	stop(e){

		window.removeEventListener('mousemove', this.moveDrag);
		window.removeEventListener('mouseup', this.stop);

		this.options.onEnd && this.options.onEnd(e, this.dragInfo, this.payload);

		this.dragInfo = null;
		this.payload = null;
	}

	updateRef(ref){
		this.dragInfo.itemBB = ref.getBoundingClientRect();
	}

}
