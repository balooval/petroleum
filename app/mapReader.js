import SvgParser from '../vendor/svg-parser.js';


export function read(_svgString) {
	const polygons = [];
	const svgParsed = SvgParser(_svgString);
	const shapes = svgParsed.children[0].children;
	shapes.shift();
	const paths = getPaths(shapes[0]);
	paths.forEach(path => {
		const coords = parsePath(path);
		polygons.push(coords.reverse());
	});
	return polygons;
}

function parsePath(_path) {
	const reduced = _path.slice(1, -1);
	const coordCouples = reduced.split('l');
	coordCouples.pop();
	const startCoord = readCoordCouple(coordCouples.shift());
	const relativeCoords = coordCouples.map(readCoordCouple);
	let lastCoord = startCoord;
	const coords = [];
	relativeCoords.forEach(coord => {
		const curCoord = [
			coord[0] + lastCoord[0],
			coord[1] + lastCoord[1],
		];
		lastCoord = curCoord;
		coords.push(curCoord);
	});
	coords.unshift(startCoord);
	return coords;
}

function readCoordCouple(_couple) {
	const tokens = _couple.split(',');
	return [
		parseInt(tokens[0]),
		parseInt(tokens[1]),
	];
}

function getPaths(_shape) {
	const paths = _shape.children.filter(child => child.tagName == 'path');
	return paths.map(path => path.properties.d);
}