import * as Renderer from './renderer.js';
import * as Stepper from './stepper.js';
import * as Emiter from './emiter.js';
import * as Input from './input.js';
import * as Ocean from './ocean.js';
import * as Environment from './environment.js';
import * as Rtt from './rtt.js';
import * as AnimationControl from './animationControl.js';
import * as Terrain from './terrain.js';

let debugEffect;

export let scene = null;

function init() {
	Renderer.init('main');
	Rtt.init();
	Stepper.init();
	Input.init();
	Emiter.init();
	Input.evt.addEventListener('DOWN', null, onKeyDown); 
	initScene();
	start();
} 

function onKeyDown(_key) {
	if (_key == 87) { // w
		setCam('side');
	} else if (_key == 67) { // c
		setCam('top');
	}
}
	
export function setCam(_view) {
	if (_view == 'side') {
		Renderer.camera.position.set(-100, 20, -20);
		Renderer.camera.lookAt(new THREE.Vector3(0, 20, -30));
	} else if (_view == 'front') {
		Renderer.camera.position.set(0, 20, 30);
		Renderer.camera.lookAt(new THREE.Vector3(0, 5, -10));
	} else if (_view == 'top') {
		Renderer.camera.position.set(0, 100, 10);
		Renderer.camera.lookAt(new THREE.Vector3(0, 0, -40));
	}
}

export function start() {
	AnimationControl.registerToUpdate(Renderer.controls);
	AnimationControl.registerToUpdate(Rtt);
	AnimationControl.registerToUpdate(Renderer);
	AnimationControl.registerToUpdate(Stepper);
	AnimationControl.registerToUpdate(Emiter);
	AnimationControl.registerToUpdate(Ocean);
	AnimationControl.start();
}

function initScene() {
	debugEffect = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 6));
	debugEffect.position.z = 3;
	Renderer.scene.add(Rtt.meshScreen);
	
	Ocean.init();
	const water = Ocean.build();
	Renderer.scene.add(water);
	const terrain = Terrain.build();
	terrain.position.x = -200;
	terrain.position.y = -5;
	terrain.position.z = -100;
	Renderer.scene.add(terrain);
	Environment.init();
}

init();