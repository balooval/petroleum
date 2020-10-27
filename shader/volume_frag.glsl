uniform sampler2D colorMap;
uniform sampler2D depthMap;
uniform float tileNbX;
uniform float uViewAngleStep;

varying vec2 vUv;
varying vec2 uTileUv;


varying float vDistCamToVert;
varying float vCamAngle;
varying vec3 vCamToVert;
varying float vUvPart;
varying vec3 debug;

float pi = 3.1415926535897932384626433832795;

float W0AngleRel;

// Calcule le vecteur de la vue relativeent à la caméra (perpendiculaire à la caméra = vec3(1.0, 0.0, 0.0))
vec3 calcViewDirection(vec2 viewUv) {
	// Angle orientation Tile "choisie" (-pi => +pi)
	float viewAngle = (uViewAngleStep * (viewUv.x / vUvPart)) - pi;
	// on décale l'angle de 90° pour que la vue soit perpendiculaire à la caméra
	// viewAngle += (pi / 2.0);
	// on décale l'angle de la vue d'un demi step
	viewAngle += uViewAngleStep / 2.0;
	viewAngle = mod((viewAngle + pi), (2.0 * pi)) - pi;
	float viewAngleRel = viewAngle - vCamAngle;
	viewAngleRel = mod((viewAngleRel + pi), (2.0 * pi)) - pi;
	vec3 viewDirection = vec3(cos(viewAngleRel), 0.0, sin(viewAngleRel));
	return viewDirection;
}

float projectPoint(vec3 _pointDir, vec3 _point, vec3 _view) {
	vec3 viewVec = normalize(_view);
	float pointPrct = dot(_pointDir, _point) / length(_pointDir);
	vec3 planeVec = normalize(_pointDir);
	float Dot = dot(planeVec, viewVec);
	float res = pointPrct * Dot;
	return res;
}

float getDepth(float P, vec2 viewUv) {
	vec2 tmpUv = vec2(viewUv.x + ((P+0.5) / tileNbX), viewUv.y + vUv.y);
	float viewDepth = texture2D(depthMap, tmpUv).r;
	return viewDepth;
}

void main() {
	vec4 finalColor;
	vec2 tmpUv = vec2(uTileUv.x + (vUv.x / tileNbX), uTileUv.y + vUv.y);
	finalColor = texture2D(colorMap, tmpUv);
	if (finalColor.a < 0.3) {
		discard;
		// finalColor = vec4(1.0);
	}
	
	/*
	vec2 curViewUv = vec2(uTileUv.xy);
	vec2 viewOffset = vec2(vUvPart, 0.0);
	
	// vec3 viewDir = calcViewDirection(curViewUv);
	// float viewPrct = dot(vec3(1.0, 0.0, 0.0), viewDir);
	// finalColor = vec4(vec3(viewPrct), 1.0);
	
	
	vec3 P = vec3(0.0);
	P.x = vUv.x - 0.5;
	
	float projP;
	float depth = 0.0;
	float viewPrct = 0.0;
	vec3 viewDir;
	vec3 dirP = vec3(1.0, 0.0, 0.0);
	viewPrct = 1.0;
	viewDir = calcViewDirection(curViewUv);
	viewPrct = max(dot(vec3(1.0, 0.0, 0.0), viewDir), 0.0);
	projP = projectPoint(dirP, P, viewDir);
	depth += getDepth(projP, curViewUv) * viewPrct;
	
	viewDir = calcViewDirection(curViewUv + viewOffset);
	viewPrct = max(dot(vec3(1.0, 0.0, 0.0), viewDir), 0.0);
	projP = projectPoint(dirP, P, viewDir);
	depth += getDepth(projP, curViewUv + viewOffset) * viewPrct;
	viewDir = calcViewDirection(curViewUv - viewOffset);
	viewPrct = max(dot(vec3(1.0, 0.0, 0.0), viewDir), 0.0);
	projP = projectPoint(dirP, P, viewDir);
	depth += getDepth(projP, curViewUv - viewOffset) * viewPrct;
	// depth /= 3.0;
	
	finalColor = vec4(vec3(depth), 1.0);
	*/
	/*
	float CP = 1.0 + abs(sin(P.x));
	float CQ = CP - depth;
	float B = (abs(P.x) * (CQ / CP));
	float projQ;
	// Relation de Chasle
	vec3 Q = vec3(0.0);
	Q.x = B;
	Q.z = CP - CQ;
	vec3 dirQ = vec3(1.0, 0.0, 0.0);
	depth = 0.0;
	finalColor = vec4(vec3(Q.z), 1.0);
	viewDir = calcViewDirection(curViewUv);
	viewPrct = max(dot(vec3(1.0, 0.0, 0.0), viewDir), 0.0);
	projQ = projectPoint(dirQ, Q, viewDir);
	depth += getDepth(projQ, curViewUv) * viewPrct;
	viewDir = calcViewDirection(curViewUv + viewOffset);
	viewPrct = max(dot(vec3(1.0, 0.0, 0.0), viewDir), 0.0);
	projQ = projectPoint(dirQ, Q, viewDir);
	depth += getDepth(projQ, curViewUv + viewOffset) * viewPrct;
	viewDir = calcViewDirection(curViewUv - viewOffset);
	viewPrct = max(dot(vec3(1.0, 0.0, 0.0), viewDir), 0.0);
	projQ = projectPoint(dirQ, Q, viewDir);
	depth += getDepth(projQ, curViewUv - viewOffset) * viewPrct;
	depth /= 2.0;
	finalColor = vec4(vec3(depth), 1.0);
	*/
	gl_FragColor = finalColor;
}
