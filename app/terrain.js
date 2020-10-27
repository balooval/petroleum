export function build () {
	var geometry = new THREE.Geometry();
	var segNb = 50;
	var len = 100;
	var posXStart = 0;
	var posXEnd = 0;
	var curLenStart = 0;
	var curLenEnd = len;
	var depthLen = 0;
	var depth = -20;

	var indexFaceVert = 0;
	for (var i = 0; i < segNb - 1; i ++) {
		var normal = new THREE.Vector3(0, 1, 0);
		geometry.faces.push(new THREE.Face3(indexFaceVert + 0, indexFaceVert + 1, indexFaceVert + 2, normal));
		normal = new THREE.Vector3(0, 1, 0);
		geometry.faces.push(new THREE.Face3(indexFaceVert + 2, indexFaceVert + 3, indexFaceVert + 0, normal));
		
		normal = new THREE.Vector3(0, -1, 0);
		geometry.faces.push(new THREE.Face3(indexFaceVert + 6, indexFaceVert + 5, indexFaceVert + 4, normal));
		normal = new THREE.Vector3(0, -1, 0);
		geometry.faces.push(new THREE.Face3(indexFaceVert + 4, indexFaceVert + 7, indexFaceVert + 6, normal));
		
		normal = new THREE.Vector3(0, 0, 1);
		geometry.faces.push(new THREE.Face3(indexFaceVert + 5, indexFaceVert + 2, indexFaceVert + 1, normal));
		normal = new THREE.Vector3(0, 0, 1);
		geometry.faces.push(new THREE.Face3(indexFaceVert + 2, indexFaceVert + 5, indexFaceVert + 6, normal));
		indexFaceVert += 8;
	}
	
	for (var i = 0; i < segNb; i ++) {
		posXStart = posXEnd;
		posXEnd = posXStart + (Math.random() * 12) + 1;
		curLenStart = curLenEnd;
		curLenEnd = curLenStart + (Math.random() - 0.5) * 2;
		
		
		geometry.vertices.push(new THREE.Vector3(
			posXStart, 
			0, 
			0, 
		));
		geometry.vertices.push(new THREE.Vector3(
			posXStart, 
			0, 
			curLenStart, 
		));
		
		geometry.vertices.push(new THREE.Vector3(
			posXEnd, 
			0, 
			curLenEnd, 
		));
		geometry.vertices.push(new THREE.Vector3(
			posXEnd, 
			0, 
			0, 
		));
		geometry.vertices.push(new THREE.Vector3(
			posXStart, 
			depth, 
			0, 
		));
		geometry.vertices.push(new THREE.Vector3(
			posXStart, 
			depth, 
			curLenStart + depthLen, 
		));
		
		depthLen = (Math.random() - 0.5) * 10;
		
		geometry.vertices.push(new THREE.Vector3(
			posXEnd, 
			depth, 
			curLenEnd + depthLen, 
		));
		geometry.vertices.push(new THREE.Vector3(
			posXEnd, 
			depth, 
			0, 
		));
	}
	geometry.computeFlatVertexNormals();
	// geometry.computeVertexNormals();
	geometry.computeFaceNormals();
	var material = new THREE.MeshPhongMaterial( {color:0xffffff} );
	var mesh = new THREE.Mesh(geometry, material);
	return mesh;
}