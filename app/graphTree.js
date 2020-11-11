
const offsetsNeigbour = [
	[-1, 0],
	[0, -1],
	[1, 0],
	[0, 1],
];


export function build(_rootChunk) {
    const finalsChunks = getFinalsChunks(_rootChunk, []);
    finalsChunks.forEach(chunk => calcChunkNeigbours(_rootChunk, chunk));
}

function calcChunkNeigbours(_rootChunk, _chunk) {
    offsetsNeigbour.forEach(offset => {
        const coordNeigbour = [
            _chunk.coord[0] + offset[0],
            _chunk.coord[1] + offset[1],
        ];
        const neigbour = _rootChunk.getChunkAtCoord(coordNeigbour, _chunk.depth);
        if (!neigbour) {
            return;
        }
        if (_chunk.isMyNeigbour(neigbour)) {
            _chunk.addNeigbour(neigbour);
            neigbour.addNeigbour(_chunk);
        }
    });
}

function getFinalsChunks(_chunk, _values) {
    if (_chunk.childrens.length === 0) {
        _values.push(_chunk);
    }
    _chunk.childrens.forEach(chunk => {
        getFinalsChunks(chunk, _values)
    });
    return _values;
}