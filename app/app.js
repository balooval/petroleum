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
		EntitiesGenerator.setup(60);
		EntitiesGenerator.start();
	}
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

	const svg = document.getElementById('svg-content').text;
	const terrainDatas = MapReader.read(svg);
	Terrain.build(terrainDatas);
	Environment.init();
}

init();