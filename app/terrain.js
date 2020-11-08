import * as Geometry from './geometry.js';
import * as Renderer from './renderer.js';
import Earcut from '../vendor/Earcut.module.js';

export function build (_polygons) {
	console.log('_polygons', _polygons);
	const groundMesh = buildGround();
	Renderer.scene.add(groundMesh);

	// const blocsMeshes = buildBlocs(_polygons);
	// blocsMeshes.forEach(mesh => Renderer.scene.add(mesh));
}

function buildBlocs(_polygons) {
	return _polygons.map(polygon => buildBloc(polygon));
}

function buildGround() {
	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(-50, 0, -50));
	geometry.vertices.push(new THREE.Vector3(50, 0, -50));
	geometry.vertices.push(new THREE.Vector3(50, 0, 50));
	geometry.vertices.push(new THREE.Vector3(-50, 0, 50));
	geometry.faces.push(new THREE.Face3(2, 1, 0));
	geometry.faces.push(new THREE.Face3(0, 3, 2));
	geometry.computeFlatVertexNormals();
	geometry.computeFaceNormals();
	var material = new THREE.MeshPhongMaterial( {color:0xffffff} );
	var mesh = new THREE.Mesh(geometry, material);
	return mesh;
}

function buildBloc(_coords) {

	// _coords = Geometry.refinePolygon(_coords, 2);

	const geometry = new THREE.Geometry();
	const sections = [
		Geometry.offsetPolygon(_coords, 1),
		Geometry.offsetPolygon(_coords, -2),
		Geometry.offsetPolygon(_coords, 1),
		Geometry.offsetPolygon(_coords, 2),
		Geometry.offsetPolygon(_coords, 4),
		Geometry.offsetPolygon(_coords, 3),
		Geometry.offsetPolygon(_coords, 1),
	];
	// const elevations = [0, 15];
	const elevations = [0, 2, 10, 10, 12, 14, 15];
	const variations = [0, 0, 0, -4, 0, 0, 1];
	const pillarGeometry = buildSection(sections, elevations, variations);
	// pillarGeometry.computeFlatVertexNormals();
	pillarGeometry.computeVertexNormals();
	pillarGeometry.computeFaceNormals();
	geometry.merge(pillarGeometry);
	// geometry.computeVertexNormals();

	// const largeGeometry = buildSection(offsetCoords, [10, 15]);
	// largeGeometry.computeVertexNormals();
	// geometry.merge(largeGeometry);

	// geometry.computeFaceNormals();
	const material = new THREE.MeshPhongMaterial( {color:0xffffff} );
	const mesh = new THREE.Mesh(geometry, material);
	return mesh;
}

function buildSection(_sections, _elevations, _variations) {
	const geometry = new THREE.Geometry();
	const perimeterLength = _sections[0].length;
	_sections.forEach((coords, i) => {
		const elevation = _elevations[i];
		coords.forEach(coord => {
			const finalElevation = elevation + (Math.random() * _variations[i]);
			// const finalElevation = elevation;
			geometry.vertices.push(new THREE.Vector3(coord[0], finalElevation, coord[1]));
		});
	});
	let facesSteps = _sections.length - 1;
	let faceOffset = 0;
	for (let i = 0; i < facesSteps; i ++) {
		let faceIndex = 0;
		_sections[0].forEach(coord => {
			const vertIdA = (faceIndex + 0) + faceOffset;
			const vertIdB = ((faceIndex + 1) % perimeterLength) + faceOffset;
			const vertIdC = faceIndex + perimeterLength + faceOffset;
			const vertIdD = ((faceIndex + 1) % perimeterLength) + perimeterLength + faceOffset;
			geometry.faces.push(new THREE.Face3(vertIdC, vertIdB, vertIdA));
			geometry.faces.push(new THREE.Face3(vertIdD, vertIdB, vertIdC));
			faceIndex ++;
		});
		faceOffset += perimeterLength;
	}
	const lastSection = [..._sections].pop();
	const flatCoords = lastSection.flat();
	const ceilIndex = Earcut(flatCoords);
	const ceilFacesOffset = perimeterLength * (_sections.length - 1);
	for (let i = 0; i < ceilIndex.length; i += 3) {
		geometry.faces.push(new THREE.Face3(
			ceilFacesOffset + ceilIndex[i + 2], 
			ceilFacesOffset + ceilIndex[i + 1], 
			ceilFacesOffset + ceilIndex[i + 0]
		));
	}

	return geometry;
}
