import SvgParser from '../vendor/svg-parser.js';


export function read(_svgString) {
	const svgParsed = SvgParser(_svgString);
	const path = svgParsed.children[0].children[1].children[1].properties.d;
	const coords = parsePath(path);
	// return coords;
	return coords.reverse();
}

function parsePath(_path) {
	const reduced = _path.slice(1, -1);
	const coordCouples = reduced.split('l');
	coordCouples.pop();
	console.log('coordCouples', coordCouples);
	const startCoord = readCoordCouple(coordCouples.shift());
	console.log('startCoord', startCoord);
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