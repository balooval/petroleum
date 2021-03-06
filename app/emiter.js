import * as Input from './input.js';
import * as ParticleStore from './particleStore.js';
import * as Renderer from './renderer.js';

let mesh = null;
let moveLeft = 0;
let moveRigth = 0;
let speed = 0.8;
let isShooting = false;
let shootFreq = 1;
let shootLastStep = -999;
let shootDirUpAdd = false;
let shootDirUpRem = false;
let shootAngle = -2;
let positionX = 0;

export let velocity = 0;

export function init() {
	Input.evt.addEventListener('DOWN', null, onKeyDown); 
	Input.evt.addEventListener('UP', null, onKeyUp); 
	mesh = new THREE.Mesh(new THREE.BoxGeometry( 2, 2, 6 ), new THREE.MeshBasicMaterial({color:0x502020}));
	mesh.position.y = 1;
	mesh.position.z = -12;
	Renderer.scene.add(mesh);
}

export function onKeyUp(_evt) {
	if (_evt == 'LEFT') {
		moveLeft = 0;
	} else if (_evt == 'RIGHT') {
		moveRigth = 0;
	} else if (_evt == 'SPACE') {
		isShooting = false;
	} else if (_evt == 'UP') {
		shootDirUpAdd = false;
	} else if (_evt == 'DOWN') {
		shootDirUpRem = false;
	}
}

export function onKeyDown(_evt) {
	if (_evt == 'SPACE') {
		isShooting = true;
	} else if (_evt == 'LEFT') {
		moveLeft = 1;
	} else if (_evt == 'RIGHT') {
		moveRigth = 1;
	} else if (_evt == 'UP') {
		shootDirUpAdd = true;
	} else if (_evt == 'DOWN') {
		shootDirUpRem = true;
	}
}

export function update(_step) {
	if (shootDirUpAdd) {
		shootAngle += 0.04;
	}
	if (shootDirUpRem) {
		shootAngle -= 0.04;
	}
	shootAngle = Math.max(shootAngle, -3);
	shootAngle = Math.min(shootAngle, -1.8);
	velocity = (moveLeft - moveRigth) * speed;
	positionX += velocity;
	positionX = Math.min(Math.max(positionX, -25), 25);
	mesh.position.x = positionX;
	if (isShooting) {
		shoot(_step);
	}
}

function shoot(_step) {
	if (_step - shootLastStep > shootFreq) {
		shootLastStep = _step;
		emit();
	}
}

function emit() {
	let particle;
	// console.log('shootAngle', shootAngle);
	for (let i = 0; i < 2; i ++) {
		particle = ParticleStore.get(mesh.position.clone());
		particle.setVelocity(shootAngle, -1.5, 0);
		particle.start();
	}
}