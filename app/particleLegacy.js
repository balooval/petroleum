import * as CollisionGrid from './collisionGrid.js';
import * as Rtt from './rtt.js';
import * as AnimationControl from './animationControl.js';
import * as ParticleStore from './particleStore.js';

const params = {
	vertexShader: document.getElementById('vertParticle').textContent,
	fragmentShader: document.getElementById('fragParticle').textContent,
	transparent : true,  
};
const material = new THREE.ShaderMaterial(params);

const GRAVITY = 0.03;

class Particle {
	
	constructor(_position) {
		this.position = _position;
		this.direction = new THREE.Vector3(0, 0, 0);
		this.speed = 1;
		this.mesh = this.buildMesh();
		this.init(this.position);
	}

	init(_position) {
		this.position = _position;
		this.mesh.position.set(this.position.x, this.position.y, this.position.z);
	}
	
	buildMesh() {
		const size = 5;
		const geometry = new THREE.PlaneGeometry(size, size, 1);
		return new THREE.Mesh(geometry, material);
	}
	
	setVelocity(_angle, _power, _emiterVelocity) {
		_power *= (Math.random() / 10) + 0.9;
		_angle *= (Math.random() / 10) + 0.9;
		this.direction.x = (Math.random() - 0.5) * 0.2;
		this.direction.x += _emiterVelocity * 1.5;
		this.direction.y = Math.cos(_angle) * _power;
		this.direction.z = Math.sin(_angle) * _power;
	}
	
	start() {
		AnimationControl.registerToUpdate(this);
		Rtt.scene.add(this.mesh);
	}
	
	update(_step) {
		this.position.x += this.direction.x;
		this.position.y += this.direction.y;
		this.position.z += this.direction.z;
		this.mesh.position.x = this.position.x;
		this.mesh.position.y = this.position.y;
		this.mesh.position.z = this.position.z;
		this.direction.y -= GRAVITY;
		if (this.checkGroundCollision()) {
			this.onGroundImpact();
		}
	}
	
	onGroundImpact() {
		const cellContent = CollisionGrid.getCellContent(this.position.x, this.position.z);
		this.hitObjects(cellContent);
		this.dispose();
	}

	hitObjects(_objects) {
		_objects.forEach(object => object.hit());
	}

	checkGroundCollision() {
		return this.position.y < 0;
	}

	dispose() {
		AnimationControl.unregisterToUpdate(this);
		Rtt.scene.remove(this.mesh);
		ParticleStore.cache(this);
	}
}

export {Particle as default};