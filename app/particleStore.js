import Particle from './particle.js';

const list = [];

export function cache(_particle) {
	list.push(_particle);
}

export function get(_position) {
	if (list.length > 0) {
		const part = list.shift();
		part.init(_position);
		return part;
	}
	return new Particle(_position);
}
