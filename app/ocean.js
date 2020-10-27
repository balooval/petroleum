	let materialWave;
	
export function init() {
	
}
		
export function update(_step) {
	materialWave.uniforms.time.value = _step / 100;
}
		
export function build() {
	buildMaterial();
	const gridDef = 100;
	const gridSize = 500;
	const faceSize = gridSize / gridDef;
	const bufferVertices = new Float32Array((gridDef + 1) * (gridDef + 1) * 3);
	let verticeId = 0;
	const bufferFaces = new Uint32Array(gridDef * gridDef * 2 * 3);
	let faceId = 0;
	const bufferUvs = new Float32Array((gridDef + 1) * (gridDef + 1) * 2);
	let faceUvId = 0;
	for (let i = 0; i < gridDef + 1; i ++) {
		for (let j = 0; j < gridDef + 1; j ++) {
			bufferVertices[verticeId + 0] = i * faceSize - gridSize / 2;
			bufferVertices[verticeId + 1] = 0;
			bufferVertices[verticeId + 2] = j * faceSize - gridSize / 2;
			verticeId += 3;
			
			bufferUvs[faceUvId + 0] = (1 / gridDef) * i;
			bufferUvs[faceUvId + 1] = (1 / gridDef) * j;
			faceUvId += 2;
		}
	}
	for (let i = 0; i < gridDef; i ++) {
		for (let j = 0; j < gridDef; j ++) {
			bufferFaces[faceId + 0] = ((gridDef + 1) * (i + 1)) + j;
			bufferFaces[faceId + 1] = ((gridDef + 1) * i) + j;
			bufferFaces[faceId + 2] = ((gridDef + 1) * i) + j + 1;
			bufferFaces[faceId + 3] = ((gridDef + 1) * i) + j + 1;
			bufferFaces[faceId + 4] = ((gridDef + 1) * (i + 1)) + j + 1;
			bufferFaces[faceId + 5] = ((gridDef + 1) * (i + 1)) + j;
			faceId += 6;
		}
	}
	const seaGeo = new THREE.BufferGeometry();
	seaGeo.addAttribute('position', new THREE.BufferAttribute(bufferVertices, 3));
	seaGeo.addAttribute('uv', new THREE.BufferAttribute(bufferUvs, 2));
	seaGeo.setIndex(new THREE.BufferAttribute(bufferFaces, 1));
	seaGeo.computeFaceNormals();
	seaGeo.computeVertexNormals();
	const bufferMesh = new THREE.Mesh(seaGeo, materialWave);
	return bufferMesh;
}

function buildMaterial() {
	const wavesStepsNormal =  [0.15, 0.82, 1, 0.96, 0.86, 0.26, 0, 0, 0, 0] ;
	const wavesAmpNormal =  [0.36, 0.5476, 1.4884, 1.2100000000000002, 0.17639999999999997, 1.5376, 0, 0, 0, 0] ;
	const wavesWNormal =  [0, 1.5, 5, 5, 0, 2.35, 0, 0, 0, 0] ;
	const wavesPhaseNormal =  [0.3333333333333333, 0.25, 0.11666666666666667, 0.21666666666666667, 0.11666666666666667, 0.15, 0, 0, 0, 0] ;
	const wavesDirXNormal =  [-0.9822872507286887, -1, 0.9921147013144778, 0.42577929156507205, -0.9685831611286311, -0.9048270524660194, 0, 0, 0, 0] ;
	const wavesDirYNormal =  [-0.18738131458572457, -1.2246467991473532e-16, -0.12533323356430442, 0.9048270524660198, -0.24868988716485482, 0.4257792915650729, 0, 0, 0, 0];



	const wavesSteps =  [0.8, 0.7, 0.4, 0.3, 1.1, 0.4, 0, 0, 0, 0] ;
	const wavesAmp =  [9.44, 2.25, 0.36, 2.25, 2.8899999999999997, 0.6400000000000001, 0, 0, 0, 0] ;
	const wavesW =  [10.648000000000003, 5.359375, 0.16637500000000005, 6.331625000000001, 12.166999999999996, 0.027, 0, 0, 0, 0] ;
	const wavesPhase =  [0.48333333333333334, 0.16666666666666666, 0.26666666666666666, 0.3333333333333333, 0.5, 0.3333333333333333, 0, 0, 0, 0] ;
	const wavesDirX =  [0.9921147013144778, 1, 0.9685831611286312, 6.123233995736766e-17, -0.06279051952931296, -0.30901699437494734, 1, 1, 1, 1] ;
	const wavesDirY =  [-0.12533323356430442, 0, 0.24868988716485468, -1, 0.9980267284282716, -0.9510565162951536, 0, 0, 0, 0]
			
			
	const uniforms = {
		uLightPos : {value : new THREE.Vector3(0, 0, 0)},
		time : {value : 0},
		// map : {value : textures[0]}, 			
		// mapFoam : {value : textures[1]},
		// mapSky : {value : textures[2]},
		// mapFlow : {value : textures[3]},
		
		uStepness : {value: wavesSteps}, 
		uAmplitude : {value: wavesAmp}, 
		uW : {value: wavesW}, 
		uPhase : {value: wavesPhase}, 
		uDirX : {value: wavesDirX}, 
		uDirY : {value: wavesDirY}, 
		
		uStepnessNormal : {value: wavesStepsNormal}, 
		uAmplitudeNormal : {value: wavesAmpNormal}, 
		uWNormal : {value: wavesWNormal}, 
		uPhaseNormal : {value: wavesPhaseNormal}, 
		uDirXNormal : {value: wavesDirXNormal}, 
		uDirYNormal : {value: wavesDirYNormal}, 
	};
	
	const commonShader = document.getElementById('commonWater').textContent;
	const params = {
		vertexShader: commonShader + document.getElementById('vertWater').textContent,
		fragmentShader: commonShader + document.getElementById('fragWater').textContent,
		uniforms: uniforms, 
		transparent : true, 
	};
	materialWave = new THREE.ShaderMaterial(params);
}