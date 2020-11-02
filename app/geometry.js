

export function refinePolygon(_polygon, _nb) {
	const polygon = [..._polygon];
	polygon.push(polygon[0]);
	const coords = [];
	const stepPrct = 1 / (_nb + 1);
	polygon.reduce((cum, cur, i) => {
		const prev = _polygon[i - 1];
		coords.push(prev);
		for (let i = 0; i < _nb; i ++) {
			const prct = stepPrct * (i + 1);
			const intermediateCoord = mapPosition(prev, cur, prct);
			coords.push(intermediateCoord);
		}
	})
	return coords;
}

function mapPosition(_coordA, _coordB, _prct) {
	const direction = [
		_coordB[0] - _coordA[0],
		_coordB[1] - _coordA[1],
	];
	const length = getLength(direction);
	const angle = Math.atan2(direction[1], direction[0]);
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	const rnd = Math.random() * 3;
	return [
		rnd + _coordA[0] + ((cos * length) * _prct),
		rnd + _coordA[1] + ((sin * length) * _prct),
	];
}



export function offsetPolygon(_polygon, _offset) {
	const edges = calcPolygonEdges(_polygon);
	const edgesNormales = calcEdgesNormales(edges);
	const verticesNormales = calcVerticesNormales(edgesNormales);
	const offsetedPolygon = translatePolygonVertices(_polygon, verticesNormales, _offset);
	return offsetedPolygon;
}

function translatePolygonVertices(_polygon, _directions, _offset) {
	const coords = [];
	const polygon = [..._polygon];
	polygon.push(polygon.shift());
	polygon.forEach((coord, i) => {
		coords.push([
			coord[0] + (_directions[i][0] * _offset),
			coord[1] + (_directions[i][1] * _offset),
		]);
	});
	return coords;
}

function calcPolygonEdges(_polygon) {
	const edges = [];
	const coords = [..._polygon];
	const start = coords[0];
	coords.push(start);
	coords.reduce((cum, cur, i) => {
		const prev = coords[i - 1];
		edges.push([
			prev,
			cur
		]);
	});
	return edges;
}

function calcEdgesNormales(_edges) {
	const normales = _edges.map(edge => {
		const direction = [
			edge[1][0] - edge[0][0],
			edge[1][1] - edge[0][1]
		];
		const rotatedDirection = rotateVector(direction);
		return normalize(rotatedDirection);
	});
	return normales;
}

function calcVerticesNormales(_edgesNormales) {
	const normales = [];
	const edgesNormales = [..._edgesNormales];
	edgesNormales.push(edgesNormales[0]);
	edgesNormales.reduce((cum, cur, i) => {
		const prev = edgesNormales[i - 1];
		normales.push(vectorsAverage(prev, cur));
	});
	return normales;
}

function vectorsAverage(_vectorA, _vectorB) {
	const direction = [
		(_vectorA[0] + _vectorB[0]) * 0.5,
		(_vectorA[1] + _vectorB[1]) * 0.5,
	];
	return normalize(direction);
}

function rotateVector(_vector) {
	return [
		_vector[1],
		_vector[0] * -1
	];
}


function normalize(_vector) {
	const length = getLength(_vector);
	return [
		_vector[0] / length,
		_vector[1] / length,
	]
}

function getLength(_vector) {
	return Math.sqrt(Math.pow(_vector[0], 2) + Math.pow(_vector[1], 2))
}