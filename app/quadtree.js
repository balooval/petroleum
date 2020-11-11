
export function build(_mapDatas) {
	const gridSize = _mapDatas.length;
	const rootChunk = new Chunk(0, 0, gridSize, [0, 0], 0);
	createChildrensChunks(rootChunk, _mapDatas);
	return rootChunk;
}

const offsetsNeigbour = [
	[-1, 0],
	[0, -1],
	[1, 0],
	[0, 1],
];

function createChildrensChunks(_chunk, _datas) {
	const isHomogene = containOneValue(_datas);
	if (isHomogene) {
		_chunk.setValue(_datas[0][0]);
		return;
	}
	const subDatas = splitDatas(_datas);
	if (subDatas === null) {
		return;
	}
	const offsets = [
		[0, 0],
		[1, 0],
		[0, 1],
		[1, 1],
	];
	subDatas.forEach((subData, i) => {
		const offset = offsets[i];
		const chunkSize = _chunk.size / 2;
		const chunkX = _chunk.x + (chunkSize * offset[0]);
		const chunkY = _chunk.y + (chunkSize * offset[1]);
		const coordX = (_chunk.coord[0] * 2) + offset[0];
		const coordY = (_chunk.coord[1] * 2) + offset[1];
		const chunk = new Chunk(chunkX, chunkY, chunkSize, [coordX, coordY], _chunk.depth + 1);
		chunk.setParent(_chunk);
		_chunk.addChild(chunk);
		createChildrensChunks(chunk, subData);
	});
}

function splitDatas(_datas) {
	if (_datas.length < 2) {
		return null;
	}
	const newDatasLength = _datas.length / 2;
	return [
		extractPortion(_datas, 0, newDatasLength, 0, newDatasLength),
		extractPortion(_datas, newDatasLength, newDatasLength * 2, 0, newDatasLength),
		extractPortion(_datas, 0, newDatasLength, newDatasLength, newDatasLength * 2),
		extractPortion(_datas, newDatasLength, newDatasLength * 2, newDatasLength, newDatasLength * 2),
	];
}

function extractPortion(_datas, _startX, _endX, _startY, _endY) {
	const portion = [];
	for (let i = _startY; i < _endY; i ++) {
		const column = [];
		for (let j = _startX; j < _endX; j ++) {
			column.push(_datas[i][j]);
		}
		portion.push(column);
	}
	return portion;
}

function containOneValue(_datas) {
	let res = true;
	const firstValue = _datas[0][0];
	parse(_datas, value => {
		if (value != firstValue) {
			res = false;
		}
	});
	return res;
}

function parse(_datas, _callback) {
	const datasLength = _datas.length;
	for (let i = 0; i < datasLength; i ++) {
		for (let j = 0; j < datasLength; j ++) {
			const curValue = _datas[i][j];
			_callback(curValue, i, j);
		}
	}
}

export class Chunk {
	constructor(_x, _y, _size, _coord, _depth) {
		this.x = _x;
		this.y = _y;
		this.size = _size;
		this.center = [
			this.x + (this.size / 2),
			this.y + (this.size / 2),
		];
		this.coord = _coord;
		this.depth = _depth;
		this.parent = null;
		this.childrens = [];
		this.neigbours = [];
		this.neigboursDistances = [];
		this.value = null;
	}

	setValue(_value) {
		this.value = _value;
	}

	setParent(_chunk) {
		this.parent = _chunk;
	}

	addChild(_chunk) {
		this.childrens.push(_chunk)
	}

	addNeigbour(_chunk) {
		if (this.neigbours.includes(_chunk)) {
			return null;
		}
		this.neigbours.push(_chunk);
		const distance = this.getDistanceToChunk(_chunk);
		this.neigboursDistances.push(distance);
	}

	getDistanceToChunk(_chunk) {
		return Math.sqrt(
			Math.pow(this.center[0] - _chunk.center[0], 2)
			+
			Math.pow(this.center[1] - _chunk.center[1], 2)
		);
	}

	getNeigbourAtOffset(_offsetX, _offsetY) {
		let index = -1;
		offsetsNeigbour.forEach((offset, i) => {
			if (offset[0] == _offsetX && offset[1] == _offsetY) {
				index = i;
			}
		});
		return this.neigbours[index];
	}

	getChunkAtPosition(_x, _y) {
		if (this.containPosition(_x, _y) === false) {
			return null;
		}
		if (this.childrens.length === 0) {
			return this;
		}
		const res = this.childrens
			.map(child => child.getChunkAtPosition(_x, _y))
			.filter(child => child !== null)
			.pop();
		return res;
	}

	containPosition(_x, _y) {
		if (this.x > _x) return false;
		if (this.y > _y) return false;
		if (this.x + this.size < _x) return false;
		if (this.y + this.size < _y) return false;
		return true;
	}

	getChunkAtCoord(_coord, _depth) {
		const convertedCoord = this.convertCoordToSmallerDepth(_coord, _depth, this.depth);
		if (!convertedCoord) {
			return null;
		}
		if (this.coord[0] != convertedCoord[0]) {
			return null;
		}
		if (this.coord[1] != convertedCoord[1]) {
			return null;
		}
		if (this.childrens.length === 0) {
			return this;
		}
		const res = this.childrens
			.map(child => child.getChunkAtCoord(_coord, _depth))
			.filter(child => child !== null)
			.pop();
		return res;
	}

	containCoordAtDepth(_coord, _depth) {
		const includeCoord = this.coordIncludingForDepth(_depth);
		if (includeCoord.minX > _coord[0]) return false;
		if (includeCoord.maxX < _coord[0]) return false;
		if (includeCoord.minY > _coord[1]) return false;
		if (includeCoord.maxY < _coord[1]) return false;
		return true;
	}

	coordIncludingForDepth(_depth) {
		const depthGap = _depth - this.depth;
		const minX = this.coord[0] * Math.pow(2, depthGap);
		const maxX = ((this.coord[0] + 1) * Math.pow(2, depthGap)) - 1;
		const minY = this.coord[1] * Math.pow(2, depthGap);
		const maxY = ((this.coord[1] + 1) * Math.pow(2, depthGap)) - 1;
		return {minX, maxX, minY, maxY};
	}

	convertCoordToSmallerDepth(coord, _orgDepth, _targetDepth) {
		const depthGap = _orgDepth - _targetDepth;
		if (depthGap < 0) {
			return null;
		}
		const scale = Math.pow(2, depthGap);
		const coordX = Math.floor(coord[0] / scale);
		const coordY = Math.floor(coord[1] / scale);
		return [coordX, coordY];
	}

	getRoot() {
		if (this.parent === null) {
			return this;
		}
		return this.parent.getRoot();
	}

	isMyNeigbour(_chunk) {
		let chunkA = this;
		let chunkB = _chunk;
		const depthDiff = _chunk.depth - this.depth;
		if (depthDiff > 0) {
			chunkA = _chunk;
			chunkB = this;
		}
		let isNeigbour = false;
		offsetsNeigbour.forEach(offset => {
			const neigbourCoord = [
				chunkA.coord[0] + offset[0],
				chunkA.coord[1] + offset[1],
			];
			if (chunkB.containCoordAtDepth(neigbourCoord, chunkA.depth)) {
				isNeigbour = true;
			}
		});
		return isNeigbour;
	}
}