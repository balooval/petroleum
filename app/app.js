import * as AnimationControl from './animationControl.js';
import * as Emiter from './emiter.js';
import * as Environment from './environment.js';
import * as Input from './input.js';
import * as MATH from './math.js';
import * as Ocean from './ocean.js';
import * as Renderer from './renderer.js';
import * as Rtt from './rtt.js';
import * as Stepper from './stepper.js';
import * as Terrain from './terrain.js';
import Entitie from './entitie.js';
import * as CollisionGrid from './collisionGrid.js';
import * as EntitiesGenerator from './entitiesGenerator.js';

export let scene = null;

const test = {toto : '1'};

function init() {
	Renderer.init('main');
	Rtt.init();
	Stepper.init();
	Input.init();
	Emiter.init();
	
	CollisionGrid.init(10, 5);

	Input.evt.addEventListener('DOWN', null, onKeyDown); 
	initScene();
	start();
} 

function onKeyDown(_key) {
	if (_key == 67) { // c
		// testEntitie();
		EntitiesGenerator.setup(60);
		EntitiesGenerator.start();
	}
}

function testEntitie() {
	const position = new THREE.Vector3(0, 0, 50);
	const entitie = new Entitie(position);
	entitie.addDestination(MATH.randomDirection(20), 20);
	entitie.addDestination(MATH.randomDirection(10), 0);
	entitie.start();

	// const posX = Math.floor(Math.random() * 60);
	// const posY = Math.floor(Math.random() * 80);
	// CollisionGrid.updateCell(test, posX, posY);
}

export function start() {
	// AnimationControl.registerToUpdate(Renderer.controls);
	AnimationControl.registerToUpdate(Rtt);
	AnimationControl.registerToUpdate(Renderer);
	AnimationControl.registerToUpdate(Stepper);
	AnimationControl.registerToUpdate(Emiter);
	AnimationControl.registerToUpdate(Ocean);
	AnimationControl.start();
}

function initScene() {
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