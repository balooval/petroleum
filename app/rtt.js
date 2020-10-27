import * as Renderer from './renderer.js';

let bufferTexture;
let textureW = 256;
let textureH = 256;

export let scene = null;
export let meshScreen = null;

export function init() {
	scene = new THREE.Scene();
	bufferTexture = new THREE.WebGLRenderTarget(textureW, textureH, {
		wrapS : THREE.RepeatWrapping, 
		wrapT : THREE.RepeatWrapping, 
		stencilBuffer : false, 
		magFilter : THREE.LinearFilter, 
		minFilter : THREE.LinearMipMapLinearFilter, 
	});
	
	
	const params = {
		vertexShader: document.getElementById('vertRtt').textContent,
		fragmentShader: document.getElementById('fragRtt').textContent,
		transparent : true, 
		uniforms : {
			map : {value : getTexture()}
		}
	};
	meshScreen = new THREE.Mesh(
		new THREE.PlaneGeometry(30, 30, 1), 
		new THREE.ShaderMaterial(params)
		// new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide, map: getTexture()})
	);
}

export function update() {
	Renderer.renderer.setClearColor(0x000000, 0);
	Renderer.renderer.render(scene, Renderer.camera, bufferTexture, false);
	Renderer.renderer.setClearColor(0xaec8e2, 1 );
}

export function getTexture() {
	return bufferTexture.texture;
}