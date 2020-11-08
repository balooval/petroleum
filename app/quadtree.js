export function build(_mapDatas) {
	const gridSize = _mapDatas.length;
	const rootBloc = new Bloc(0, 0, gridSize, [0, 0], 0);
	createChildrensBlocs(rootBloc, _mapDatas);
	return rootBloc;
}

const offsetsNeigbour = [
	[-1, 0],
	[0, -1],
	[1, 0],
	[0, 1],
];

function createChildrensBlocs(_bloc, _datas) {
	const isHomogene = containOneValue(_datas);
	if (isHomogene) {
		_bloc.setValue(_datas[0][0]);
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
		const blocSize = _bloc.size / 2;
		const blocX = _bloc.x + (blocSize * offset[0]);
		const blocY = _bloc.y + (blocSize * offset[1]);
		const coordX = (_bloc.coord[0] * 2) + offset[0];
		const coordY = (_bloc.coord[1] * 2) + offset[1];
		const bloc = new Bloc(blocX, blocY, blocSize, [coordX, coordY], _bloc.depth + 1);
		bloc.setParent(_bloc);
		_bloc.addChild(bloc);
		createChildrensBlocs(bloc, subData);
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

export class Bloc {
	constructor(_x, _y, _size, _coord, _depth) {
		this.x = _x;
		this.y = _y;
		this.size = _size;
		this.coord = _coord;
		this.depth = _depth;
		this.parent = null;
		this.childrens = [];
		this.value = null;
	}

	setValue(_value) {
		this.value = _value;
	}

	setParent(_bloc) {
		this.parent = _bloc;
	}

	addChild(_bloc) {
		this.childrens.push(_bloc)
	}

	getBlocAtPosition(_x, _y) {
		if (this.containPosition(_x, _y) === false) {
			return null;
		}
		if (this.childrens.length === 0) {
			return this;
		}
		const res = this.childrens
			.map(child => child.getBlocAtPosition(_x, _y))
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

	getBlocAtCoord(_coord, _depth) {
		const convertedCoord = this.convertCoordToSmallerDepth(_coord, _depth, this.depth);
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
			.map(child => child.getBlocAtCoord(_coord, _depth))
			.filter(child => child !== null)
			.pop();
		return res;
	}

	containCoord(_coord) {
		if (this.coord[0] > _coord[0]) return false;
		if (this.coord[1] > _coord[1]) return false;
		if (this.coord[0] + this.size < _x) return false;
		if (this.y + this.size < _y) return false;
		return true;
	}

	coordIncludingForDepth(_depth) {
		const depthGap = _depth - this.depth;
		const minX = this.coord[0] * Math.pow(2, depthGap);
		const maxX = (this.coord[0] + 1) * Math.pow(2, depthGap);
		const minY = this.coord[1] * Math.pow(2, depthGap);
		const maxY = (this.coord[1] + 1) * Math.pow(2, depthGap);
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

	isMyNeigbour(_bloc) {
		let isNeigbour = false;
		const coordToBlocDepth = this.convertCoordToSmallerDepth(this.coord, this.depth, _bloc.depth);
		console.log('coordToBlocDepth', coordToBlocDepth);
		offsetsNeigbour.forEach(offset => {
			const nextCoordX = coordToBlocDepth[0] + offset[0];
			const nextCoordY = coordToBlocDepth[1] + offset[1];
			if (nextCoordX != _bloc.coord[0]) return false;
			if (nextCoordY != _bloc.coord[1]) return false;
			isNeigbour = true;
		});
		return isNeigbour;
	}
}