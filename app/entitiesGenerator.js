import * as Stepper from './stepper.js';
import Entitie from './entitie.js';
import * as MATH from './math.js';

let interval = 0;

export function setup(_interval) {
	interval = _interval;
}

export function start() {
	const nextStep = Stepper.curStep + interval;
	Stepper.listenStep(nextStep, null, onStep);
}

function onStep(_step) {
	Stepper.stopListenStep(_step, null, onStep);
	Stepper.listenStep(_step + interval, null, onStep);
	createEntitie();
}

function createEntitie() {
	const startX = MATH.randomDirection(40);
	const position = new THREE.Vector3(startX, 0, 50);
	const entitie = new Entitie(position);
	entitie.addDestination(MATH.randomDirection(20), 20);
	entitie.addDestination(MATH.randomDirection(10), 0);
	entitie.start();
}