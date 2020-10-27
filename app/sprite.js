import * as Motion from './motion.js';
import * as Stepper from './stepper.js';
import * as AnimationControl from './animationControl.js';
import * as Rtt from './rtt.js';
import * as ParticleStore from './particleStore.js';

class Sprite {

	constructor(_position) {
		this.motionScale = new Motion.Accel();
		this.motionPosX = new Motion.Accel();
		this.motionPosZ = new Motion.Accel();
		this.motionPosY = new Motion.Accel();
		this.speed = 1;
		this.direction = new THREE.Vector3(0, 0, -1);
		this.mesh = this.buildMesh();
		this.init(_position);
	}
	
	buildMesh() {
		const size = 2;
		return new THREE.Mesh(new THREE.BoxGeometry(size, size, size), new THREE.MeshBasicMaterial({color:0x000060}));
	}
	
	init(_position) {
		this.stepOffset = Stepper.curStep;
		this.mesh.position.set(_position.x, _position.y, _position.z);
	}
	
	start() {
		AnimationControl.registerToUpdate(this);
		Rtt.scene.add(this.mesh);
	}
	
	update(_step) {
		
	}
	
	updateToTime(_step) {
		const t = _step - this.stepOffset;
		this.motionScale.updateToTime(t);
		this.motionPosX.updateToTime(t);
		this.motionPosY.updateToTime(t);
		this.motionPosZ.updateToTime(t);
		this.stepOffset = _step;
	}
	
	dispose() {
		Stepper.clearListenStep(this);
		AnimationControl.unregisterToUpdate(this);
		Rtt.scene.remove(this.mesh);
		ParticleStore.cache(this);
	}
}

export {Sprite as default};