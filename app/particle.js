import Sprite from './sprite.js';
import * as Stepper from './stepper.js';
import * as CollisionGrid from './collisionGrid.js';

const params = {
	vertexShader: document.getElementById('vertParticle').textContent,
	fragmentShader: document.getElementById('fragParticle').textContent,
	transparent : true,  
};
const material = new THREE.ShaderMaterial(params);

class Particle extends Sprite{
	
	constructor(_position) {
		super(_position);
		this.dirUp = 0;
		this.dirFront = 0;
		this.dirSide = 0;
	}
	
	buildMesh() {
		const size = 5;
		const geometry = new THREE.PlaneGeometry(size, size, 1);
		return new THREE.Mesh(geometry, material);
	}
	
	setVelocity(_angle, _power, _emiterVelocity) {
		_power *= (Math.random() / 10) + 0.9;
		_angle *= (Math.random() / 10) + 0.9;
		this.dirUp = Math.cos(_angle) * _power;
		this.dirFront = Math.sin(_angle) * _power;
		this.dirSide = (Math.random() - 0.5) * 0.2;
		this.dirSide += _emiterVelocity * 1.5;
	}
	
	start() {
		this.motionScale.value = 0.1;
		this.motionScale.accel = 0;
		this.motionScale.speed = 0.03;
		const stepScaleFull = this.motionScale.getTimeByValue(1)[0];
		Stepper.listenStep(stepScaleFull + this.stepOffset, this, this.onStopScale);
		
		this.motionPosX.value = this.mesh.position.x;
		this.motionPosX.accel = this.dirSide * -0.01;
		this.motionPosX.speed = this.dirSide;
		
		const stepStopSide = this.motionPosX.getTimeBySpeed(0);
		Stepper.listenStep(stepStopSide + this.stepOffset, this, this.onStopSide);
		
		this.motionPosY.value = this.mesh.position.y;
		this.motionPosY.accel = -0.02;
		this.motionPosY.speed = this.dirUp;
		
		this.motionPosZ.value = this.mesh.position.z;
		this.motionPosZ.accel = 0.005;
		this.motionPosZ.speed = this.dirFront;
		
		const stepStopFront = this.motionPosZ.getTimeBySpeed(0);
		Stepper.listenStep(stepStopFront + this.stepOffset, this, this.onStopFront);
		
		const stepAtGround = this.motionPosY.getTimeByValue(0)[0];
		Stepper.listenStep(stepAtGround + this.stepOffset, this, this.onGround);
		super.start();
	}
	
	onStopScale(_step) {
		Stepper.stopListenStep(_step, this, this.onStopScale);
		this.updateToTime(_step);
		this.motionScale.value = 1;
		this.motionScale.accel = 0;
		this.motionScale.speed = 0;
	}
	
	onStopSide(_step) {
		Stepper.stopListenStep(_step, this, this.onStopSide);
		this.updateToTime(_step);
		this.motionPosX.value = this.mesh.position.x;
		this.motionPosX.accel = 0;
		this.motionPosX.speed = 0;
	}
	
	onStopFront(_step) {
		Stepper.stopListenStep(_step, this, this.onStopFront);
		this.updateToTime(Stepper.curStep);
		this.motionPosZ.value = this.mesh.position.z;
		this.motionPosZ.accel = 0;
		this.motionPosZ.speed = 0;
	}
	
	onGround(_step) {
		Stepper.stopListenStep(_step, this, this.onGround);
		this.updateToTime(Stepper.curStep);

		const cellContent = CollisionGrid.getCellContent(this.position.x, this.position.z);
		console.log('cellContent', cellContent);

		this.motionPosY.value = this.mesh.position.y;
		this.motionPosY.accel = 0;
		this.motionPosY.speed = 0;
		
		this.motionPosX.speed /= 4;
		const stepStopSide = this.motionPosX.getTimeBySpeed(0);
		Stepper.listenStep(stepStopSide + this.stepOffset, this, this.onStopSide);
		
		this.motionPosZ.speed /= 4;
		const stepStopFront = this.motionPosZ.getTimeBySpeed(0);
		console.log('stepStopFront', stepStopFront);
		Stepper.listenStep(stepStopFront + this.stepOffset, this, this.onStopFront);
	}
	
	update(_step) {
		const t = _step - this.stepOffset;
		const scale = this.motionScale.getValueAt(t);
		this.mesh.scale.set(scale, scale, scale);
		this.mesh.position.x = this.motionPosX.getValueAt(t);
		this.mesh.position.y = this.motionPosY.getValueAt(t);
		this.mesh.position.z = this.motionPosZ.getValueAt(t);
		if (this.motionPosX.speed == 0 && this.motionPosY.speed == 0 && this.motionPosZ.speed == 0) {
			this.dispose();
		}
	}

	dispose() {
		super.dispose();
	}
}

export {Particle as default};