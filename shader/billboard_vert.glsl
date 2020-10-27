uniform float time;
uniform float tileNbX;
uniform float tileNbY;

attribute vec3 facePosition;
attribute float faceRotation;

varying vec2 vUv;
varying vec2 uTileUv;
varying float camAngleVert;

float pi = 3.1415926535897932384626433832795;

void main() {
	
	mat4 modelView = modelViewMatrix;
	int billboard = 1;
	
	if (billboard == 1) {
		if (1 == 1){
		// First colunm.
			modelView[0][0] = 1.0; 
			modelView[0][1] = 0.0; 
			modelView[0][2] = 0.0;
		}
		if (1 == 1){
			// Second colunm.
			modelView[1][0] = 0.0; 
			modelView[1][1] = 1.0; 
			modelView[1][2] = 0.0; 
		}
		if (1 == 1){
		// Thrid colunm.
			modelView[2][0] = 0.0; 
			modelView[2][1] = 0.0; 
			modelView[2][2] = 1.0; 
		}
	}
	if (billboard == 1) {
		gl_Position = (projectionMatrix * modelViewMatrix * vec4(facePosition*2.0, 1.0)) + (projectionMatrix * modelView * vec4(position, 1.0));
	} else {
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position + facePosition, 1.0);
	}
	
	vUv = uv;
	vec3 camToFace = cameraPosition - facePosition;
	camAngleVert = atan(length(camToFace.y), length(camToFace.xz)) / (pi / 2.0);
	float angleStepVert = floor(camAngleVert * tileNbY) / tileNbY;
	
	camToFace = normalize(camToFace);
	camToFace.y = 0.0;
	float camAngle = atan(camToFace.z, camToFace.x);
	float angleUnit = camAngle / pi;
	float angleUnitFlat = (angleUnit + 1.0) / 2.0;
	float angleStep = floor(angleUnitFlat * tileNbX) / tileNbX;
	angleStep = mod(angleStep + faceRotation, 1.0);
	uTileUv = vec2(angleStep, angleStepVert);
	
	
}


