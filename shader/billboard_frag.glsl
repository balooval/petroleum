uniform sampler2D colorMap;
uniform sampler2D depthMap;
uniform float tileNbX;
uniform float tileNbY;
uniform vec3 uLight;

varying vec2 vUv;
varying vec2 uTileUv;
varying float camAngleVert;

void main() {
	vec4 finalColor;
	vec2 tmpUv = vec2(uTileUv.x + (vUv.x / tileNbX), uTileUv.y + (vUv.y / tileNbY));
	finalColor = texture2D(colorMap, tmpUv);
	if (finalColor.a < 0.3) {
		discard;
	}
	
	vec3 normale = (finalColor.xyz * 2.0) - 1.0;
	float lightPrct = dot(normale, uLight);
	finalColor.xzy = vec3(lightPrct);
	
	// finalColor.xzy = vec3(camAngleVert);
	
	gl_FragColor = finalColor;
}
