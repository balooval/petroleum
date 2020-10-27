import * as Renderer from './renderer.js';

export function init() {
	const light = new THREE.PointLight(0xffffff, 1, 1000);
	light.position.x = 10;
	light.position.y = 50;
	light.position.z = 50;
	Renderer.scene.add(light);
	
	const ambiant = new THREE.AmbientLight( 0x404040 ); // soft white light
	Renderer.scene.add(ambiant);
}