class Speed {
	constructor(_value, _speed){
		this.value = _value || 0;
		this.speed = 0;
	}
	
	getTimeByValue(_val){
		return new [(_val - this.value) / this.speed];
	}

	getValueAt(_step) {
		return this.value + this.speed * _step;
	}

	getSpeedAt(_step) {
		return this.speed * _step;
	}

	updateToTime(_step) {
		this.value = this.getValueAt(_step);
		this.speed = this.getSpeedAt(_step);
	}
}
	
class Accel extends Speed {
	constructor() {
		super();
		this.accel = 0;
	}
	
	getTimeByValue(_val) {
		const tab = [];
		const sp = this.speed
		const a = this.accel;
		if(a != 0){
			let d = sp * sp -2 * a * (this.value - _val);
			if (d == 0) { // 1 seule solution
				tab[0] = sp / a;
			} else if (d > 0) { // 2 solutions
				d = Math.sqrt(d);
				tab[0] = (-sp - d) / a;
				tab[1] = (-sp + d) / a;
			}
		}else if (sp) {
			tab[0] = (_val - this.value) / sp;
		}
		return tab;
	}
	
	getValueAt(_step) {
		return this.value + this.speed * _step + (this.accel * _step * _step) / 2;
	}
	
	getSpeedAt(_step) {
		return this.speed + this.accel * _step;
	}
	
	getTimeBySpeed(_val) {
		return (_val - this.speed) / this.accel;
	}
}

export {Speed, Accel};