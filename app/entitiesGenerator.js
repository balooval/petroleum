import * as Stepper from './stepper.js';


let interval = 0;
let creationCallback = null;

export function init(_interval, _creationCallback) {
	interval = _interval;
	creationCallback = _creationCallback;
}

export function start() {
	const nextStep = Stepper.curStep + interval;
	Stepper.listenStep(nextStep, null, onStep);
}

function onStep(_step) {
	Stepper.stopListenStep(_step, null, onStep);
	Stepper.listenStep(_step + interval, null, onStep);
	creationCallback();
}