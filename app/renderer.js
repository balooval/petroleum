export let renderer;
export let camera;

export let controls;
export let scene = null;

export function init(_elmtId) {
	const mainElmt = document.getElementById(_elmtId);
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xaec8e2);
	mainElmt.appendChild(renderer.domElement);
	camera = new THREE.PerspectiveCamera(55, 1, 0.1, 10000);
	window.onresize = function () {
		renderer.setSize(mainElmt.clientWidth, mainElmt.clientHeight);
		camera.aspect = mainElmt.clientWidth / mainElmt.clientHeight;
		camera.updateProjectionMatrix();
	};
	window.onresize();
	scene = new THREE.Scene();
	let view = 'side';
	view = 'front';
	// view = 'top';
	if (view == 'side') {
		camera.position.set(-100, 20, -20);
		camera.lookAt(new THREE.Vector3(0, 20, -30));
	} else if (view == 'front') {
		camera.position.set(0, 20, 30);
		camera.lookAt(new THREE.Vector3(0, 5, -10));
	} else if (view == 'top') {
		camera.position.set(0, 100, 10);
		camera.lookAt(new THREE.Vector3(0, 0, -40));
	}
	scene.add(camera);
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.damping = 0.2;
} 

export function setCam(_view) {
	if (_view == 'side') {
		camera.position.set(-100, 20, -20);
		camera.lookAt(new THREE.Vector3(0, 20, -30));
	} else if (_view == 'front') {
		camera.position.set(0, 20, 30);
		camera.lookAt(new THREE.Vector3(0, 5, -10));
	} else if (_view == 'top') {
		camera.position.set(0, 100, 10);
		camera.lookAt(new THREE.Vector3(0, 0, -40));
	}
}

export function update() {
	renderer.render(scene, camera);
}