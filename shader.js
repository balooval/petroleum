var Shader = (function() {
	
	var callback = null;
	var path = 'shader/';
	var glslVert = null;
	var glslFrag = null; 
	var glslCommon = '';
	
	var api = {
		
		getShaderVert : function() {
			return glslCommon + glslVert;
		}, 
		
		getShaderFrag : function() {
			return glslCommon + glslFrag;
		}, 
	
		load : function(_name, _cb) {
			callback = _cb;
			
			fetch(path + _name + '_vert.glsl?time=' + Date.now())
			.then(function(response) {
				return response.text();
			})
			.then(function(_glsl) {
				glslVert = _glsl;
				checkShader();
			}).catch(function(error) {console.log('Fetch error :', error);});
			
			fetch(path + _name + '_frag.glsl?time=' + Date.now())
			.then(function(response) {
				return response.text();
			})
			.then(function(_glsl) {
				glslFrag = _glsl;
				checkShader();
			});
			/*
			fetch(path + _name + '_common.glsl')
			.then(function(response) {
				return response.text();
			})
			.then(function(_glsl) {
				glslCommon = _glsl;
				checkShader();
			});
			*/
		}, 

	};
	
	function checkShader() {
		if (glslVert === null) {
			return false;
		}
		if (glslFrag === null) {
			return false;
		}
		// if (glslCommon === null) {
			// return false;
		// }
		console.log('Shader loaded');
		callback();
	}
	
	return api;
})();