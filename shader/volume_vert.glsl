attribute vec3 facePosition;
attribute float faceRotation;

uniform float time;
uniform float tileNbX;
uniform sampler2D depthMap;

varying vec2 vUv;
varying vec2 uTileUv;

varying float vDistCamToVert;
varying float vCamAngle;
varying float vUvPart;
varying vec3 vCamToVert;
varying vec3 debug;

float pi = 3.1415926535897932384626433832795;


/*
void getViewDepth(vec2 uTileUv, float angle) {
	// Vecteur orientation Tile "choisie"
	float viewAngleStep = (pi * 2.0) / tileNbX;
	float W0Angle = (viewAngleStep * (uTileUv.x / (1.0 / tileNbX))) - pi;
	// on décale l'angle de la vue d'un demi step
	W0Angle += viewAngleStep /2.0;
	float W0AngleRel = W0Angle - angle;
	W0AngleRel = mod((W0AngleRel + pi), (2.0 * pi)) - pi;
	vec3 W0DirCamViewRel = vec3(cos(angle), 0.0, sin(angle));
	vec3 W0Direction = vec3(cos(W0Angle), 0.0, sin(W0Angle));
	
	W0P1 = 1.0 - dot(W0Direction, W0DirCamViewRel);
	
	float uvXCentered = (uv.x * 2.0) - 1.0;
	W0P1 = uvXCentered + (uvXCentered * W0P1);
	W0P1 = (W0P1 + 1.0) / 2.0;
	
	vec2 uvP1 = vec2(uTileUv.x + (W0P1 / tileNbX), uTileUv.y + uv.y);
	float viewDepth = texture2D(depthMap, uvP1).r;
}
*/

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
	
	debug = vec3(0.0);
	
	vUv = uv;
	vCamToVert = cameraPosition - vec3(position + facePosition);
	vCamToVert.y = 0.0;
	vCamToVert = normalize(vCamToVert);
	vec3 camToFace = cameraPosition - facePosition;
	vDistCamToVert = length(camToFace);
	camToFace = normalize(camToFace);
	camToFace.y = 0.0;
	
	vCamAngle = atan(camToFace.z, camToFace.x);
	float angleUnit = vCamAngle / pi;
	float angleUnitFlat = (angleUnit + 1.0) / 2.0;
	float angleStep = floor(angleUnitFlat * tileNbX) / tileNbX;
	angleStep = mod(angleStep + faceRotation, 1.0);
	uTileUv = vec2(angleStep, 0.0);
	
	vUvPart = 1.0 / tileNbX;
	
	debug = camToFace;
	
	// getViewDepth(uTileUv, vCamAngle);
	
	
	// PROLAND Part.
	/*
	float faceWidth = 10.0;
	float uAngleUv = atan(((vUv.x * 2.0) - 1.0) * faceWidth, distCamToVert);
	
	vec3 P = vec3(0.0);
	P.x = tan(uAngleUv);
	P.y = 0.0;
	P.z = 0.5;
	P = normalize(P);
	
	// Vecteur orientation Tile "choisie"
	float viewAngleStep = (pi * 2.0) / tileNbX;
	float W0Angle = (viewAngleStep * (uTileUv.x / (1.0 / tileNbX))) - pi;
	// on décale l'angle de la vue d'un demi step
	W0Angle += viewAngleStep /2.0;
	// Calculer la différence entre l'angle de la vue choisie et l'angle que fait la caméra avec cette vue
	// soit angle camera->fac - angle de la vue
	float W0AngleRel = W0Angle - angle;
	W0AngleRel = mod((W0AngleRel + pi), (2.0 * pi)) - pi;
	// W0AngleRel = angle de la vue relativement à la caméra (-PI / +PI)
	vec3 W0DirCamViewRel = vec3(cos(angle), 0.0, sin(angle));
	vec3 W0Direction = vec3(cos(W0Angle), 0.0, sin(W0Angle));
	
	W0P1 = 1.0 - dot(W0Direction, W0DirCamViewRel);
	
	float uvXCentered = (vUv.x * 2.0) - 1.0;
	W0P1 = uvXCentered + (uvXCentered * W0P1);
	W0P1 = (W0P1 + 1.0) / 2.0;
	debug = vec3(W0P1);
	*/
}


