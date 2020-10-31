let size = 0;
let cellSize = 0;
const grid = [];
const objectsCells = new Map();

export function init(_size, _cellSize) {
	size = _size;
	cellSize = _cellSize;
	for (let i = 0; i < size; i ++) {
		const col = [];
		for (let j = 0; j < size; j ++) {
			col.push([]);
		}
		grid.push(col);
	}
}

export function updateCell(_object, _posX, _posY) {
	const cellCoord = cellCoordFromPosition(_posX, _posY)
	if (hasChangedCell(_object, cellCoord)) {
		removeFromCell(_object);
		addToCell(_object, cellCoord);
	}
}

export function getCellContent(_posX, _posY) {
	const cellCoord = cellCoordFromPosition(_posX, _posY);
	return grid[cellCoord[0]][cellCoord[1]];
}

function addToCell(_object, _cellCoord) {
	grid[_cellCoord[0]][_cellCoord[1]].push(_object);
	objectsCells.set(_object, _cellCoord);
}

function hasChangedCell(_object, _nextCell) {
	if (!objectsCells.has(_object)) {
		return true;
	}
	const curCellCoord = objectsCells.get(_object);
	if (curCellCoord[0] != _nextCell[0]) {
		return true;
	}
	if (curCellCoord[1] != _nextCell[1]) {
		return true;
	}
	return false;
}

export function removeFromCell(_object) {
	const curCellCoord = objectsCells.get(_object);
	if (!curCellCoord) {
		return;
	}
	let cell = grid[curCellCoord[0]][curCellCoord[1]];
	grid[curCellCoord[0]][curCellCoord[1]] = cell.filter(object => object != _object)
	objectsCells.delete(_object);
}


function cellCoordFromPosition(_posX, _posY) {
	const indX = Math.floor(_posX / cellSize);
	const indY = Math.floor(_posY / cellSize);
	return [
		Math.max(Math.min(indX, size - 1), 0), 
		Math.max(Math.min(indY, size - 1), 0)
	];
}