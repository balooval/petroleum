import * as AnimationControl from './animationControl.js';
import * as Emiter from './emiter.js';
import * as Environment from './environment.js';
import * as Input from './input.js';
import * as Ocean from './ocean.js';
import * as Renderer from './renderer.js';
import * as Rtt from './rtt.js';
import * as Stepper from './stepper.js';
import * as Terrain from './terrain.js';
import * as CollisionGrid from './collisionGrid.js';
import * as EntitiesGenerator from './entitiesGenerator.js';
import * as MapReader from './mapReader.js';
import Entitie from './entitie.js';
import * as MATH from './math.js';


function init() {
	Renderer.init('main');
	Rtt.init();
	const clock = new THREE.Clock();
	Stepper.init(clock);
	Input.init();
	Emiter.init();
	
	CollisionGrid.init(10, 5);

	Input.evt.addEventListener('DOWN', null, onKeyDown); 
	initScene();
	start();
} 

function onKeyDown(_key) {
	if (_key == 67) { // c
		EntitiesGenerator.init(60, createEntitie);
		EntitiesGenerator.start();
	}
}

function createEntitie() {
	const startX = MATH.randomDirection(40);
	const position = new THREE.Vector3(startX, 0, 50);
	const entitie = new Entitie(position);
	entitie.addDestination(MATH.randomDirection(20), 20);
	entitie.addDestination(MATH.randomDirection(10), 0);
	entitie.start();
}

export function start() {
	AnimationControl.registerToUpdate(Renderer);
	AnimationControl.registerToUpdate(Rtt);
	AnimationControl.registerToUpdate(Stepper);
	AnimationControl.registerToUpdate(Emiter);
	// AnimationControl.registerToUpdate(Ocean);
	AnimationControl.start();
}

function initScene() {
	Renderer.scene.add(Rtt.meshScreen);
	// Ocean.init();
	// const water = Ocean.build();
	// Renderer.scene.add(water);

	const svg = document.getElementById('svg-content-multiple').text;
	const terrainDatas = MapReader.read(svg);
	Terrain.build(terrainDatas);
	Environment.init();
}

init();