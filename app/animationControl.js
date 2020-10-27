import * as Stepper from './stepper.js';

let registeredToUpdate = [];

export function start() {
	animate();
}

export function registerToUpdate(_object) {
	registeredToUpdate.push(_object);
}

export function unregisterToUpdate(_object) {
	registeredToUpdate = registeredToUpdate.filter(object => object != _object);
}

function animate() {
	requestAnimationFrame(animate);
	registeredToUpdate.forEach(object => object.update(Stepper.curStep));
}
