import Evt from './event.js';

let clock;
let timeSinceLastFrame = 0;
const stepBySec = 60;
	
export let evt = null;
export let curStep = 0;

export function init() {
	evt = new Evt();
	clock = new THREE.Clock();
	clock.start();
}

export function listenStep(_step, _obj, _callback) {
	evt.addEventListener('STEP_' + Math.trunc(_step), _obj, _callback);
}

export function stopListenStep(_step, _obj, _callback) {
	evt.removeEventListener('STEP_' + Math.trunc(_step), _obj, _callback);
}

export function clearListenStep(_obj) {
	evt.clearEventListener(_obj);
}

export function update() {
	const nextStep = Math.trunc(clock.getElapsedTime() * stepBySec);
	for (let lastStep = curStep; lastStep < nextStep; lastStep ++) {
		evt.fireEvent('STEP_' + lastStep, lastStep);
	}
	curStep = nextStep;
}
		