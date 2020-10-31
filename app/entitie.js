import * as Stepper from './stepper.js';
import * as AnimationControl from './animationControl.js';
import * as Renderer from './renderer.js';
import * as CollisionGrid from './collisionGrid.js';

class Entitie {

	constructor(_position) {
		this.position = _position;
		this.destinations = [];
		this.nextDestination = null;
		this.direction = new THREE.Vector3(0, 0, 0);
		this.speed = 0.2;
		this.mesh = this.buildMesh();
		this.mesh.position.set(_position.x, _position.y, _position.z);
	}
	
	buildMesh() {
		const size = 2;
		const geometry = new THREE.BoxGeometry(size, size, size);
		const material = new THREE.MeshBasicMaterial({color: 0xff0000});
		return new THREE.Mesh(geometry, material);
	}

	addDestination(_posX, _posZ) {
		const newDestination = new THREE.Vector3(_posX, 0, _posZ);
		this.destinations.push(newDestination);
	}
	
	start() {
		Renderer.scene.add(this.mesh);
		AnimationControl.registerToUpdate(this);
		this.gotoNextDestination();
	}
	
	gotoNextDestination() {
		this.nextDestination = this.destinations.shift();
		if (!this.nextDestination) {
			return false;
		}
		const angle = Math.atan2(this.nextDestination.z - this.position.z, this.nextDestination.x - this.position.x);
		this.direction.x = Math.cos(angle);
		this.direction.z = Math.sin(angle);
		return true;
	}
	
	onDestination() {
		if (!this.gotoNextDestination()) {
			AnimationControl.unregisterToUpdate(this);
			this.dispose();
		}
	}
	
	update(_step) {
		this.position.x += this.direction.x * this.speed;
		this.position.y += this.direction.y * this.speed;
		this.position.z += this.direction.z * this.speed;
		this.mesh.position.set(this.position.x, this.position.y, this.position.z);
		CollisionGrid.updateCell(this, this.position.x, this.position.z);
		if (this.hasReachDestination()) {
			this.onDestination();
		}
	}

	hasReachDestination() {
		const distance = this.position.distanceTo(this.nextDestination);
		return distance < 1;
	}

	hit() {
		console.log('hit');
		this.dispose();
	}
	
	dispose() {
		Renderer.scene.remove(this.mesh);
		AnimationControl.unregisterToUpdate(this);
		CollisionGrid.removeFromCell(this);
	}
}

export {Entitie as default};