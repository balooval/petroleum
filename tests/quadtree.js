import * as Quadtree from '../app/quadtree.js';

QUnit.module('Quadtree');

const datas = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 1, 1, 1, 0],
  [0, 0, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

QUnit.test('Build quadtree', assert => {
  const rootChunk = Quadtree.build(datas);
  assert.true(rootChunk instanceof Quadtree.Chunk, 'Return Chunk');
});

QUnit.test('Get chunk at position', assert => {
  const rootChunk = Quadtree.build(datas);
  const targetChunk = rootChunk.getChunkAtPosition(5, 3);
  assert.true(targetChunk instanceof Quadtree.Chunk, 'Chunk found');
  assert.equal(targetChunk.x, 5, 'X is correct');
  assert.equal(targetChunk.y, 3, 'Y is correct');
  assert.equal(targetChunk.childrens.length, 0, 'No childrens');
});

QUnit.test('Get no chunk at position', assert => {
  const rootChunk = Quadtree.build(datas);
  const returnedChunk = rootChunk.getChunkAtPosition(54, -50);
  assert.equal(returnedChunk, null, 'Found no chunk outside');
});

QUnit.test('Search chunk by coord', assert => {
  const rootChunk = Quadtree.build(datas);
  let child = rootChunk.getChunkAtCoord([4, 3], 3);
  assert.true(child instanceof Quadtree.Chunk, 'Chunk found');

  child = rootChunk.getChunkAtCoord([2, 1], 2);
  assert.notOk(child, 'No chunk (depth too low)');
});

QUnit.test('Convert coord', assert => {
  const rootChunk = Quadtree.build(datas);
  const convertedCoordToSmallerDepth = rootChunk.convertCoordToSmallerDepth([5, 1], 3, 2)
  assert.deepEqual(convertedCoordToSmallerDepth, [2, 0], 'Coord converted to smaller depth');
  const convertedCoordToHigherDepth = rootChunk.convertCoordToSmallerDepth([2, 0], 2, 3)
  assert.notOk(convertedCoordToHigherDepth, 'Coord converted to higher depth is null');
});

QUnit.test('Contain coord', assert => {
  const rootChunk = Quadtree.build(datas);
  const chunk = rootChunk.getChunkAtCoord([0, 0], 1);
  let contain = chunk.containCoordAtDepth([1, 1], 2);
  assert.true(contain, 'Chunk contain coord at depth');
  contain = chunk.containCoordAtDepth([2, 1], 3);
  assert.true(contain, 'Chunk contain coord at depth');
  contain = chunk.containCoordAtDepth([4, 0], 3);
  assert.false(contain, 'Chunk not contain coord at depth');
  contain = chunk.containCoordAtDepth([1, 7], 3);
  assert.false(contain, 'Chunk not contain coord at depth');
  contain = chunk.containCoordAtDepth([4, 4], 3);
  assert.false(contain, 'Chunk not contain coord at depth');
});

QUnit.test('Test if chunks are neighbours', assert => {
  const rootChunk = Quadtree.build(datas);
  const chunkDepth_1 = rootChunk.getChunkAtCoord([3, 2], 3);

  let chunkDepth_3 = rootChunk.getChunkAtCoord([4, 3], 3);
  let mustBeNeigbour = chunkDepth_3.isMyNeigbour(chunkDepth_1);
  assert.true(mustBeNeigbour, 'Chunks are neigbour (small vs big)');

  mustBeNeigbour = chunkDepth_1.isMyNeigbour(chunkDepth_3);
  assert.true(mustBeNeigbour, 'Chunks are neigbour (big vs small)');
  
  chunkDepth_3 = rootChunk.getChunkAtCoord([6, 5], 3);
  let mustNotBeNeigbour = chunkDepth_3.isMyNeigbour(chunkDepth_1);
  assert.false(mustNotBeNeigbour, 'Chunks are not neigbour (small vs big)');

  chunkDepth_3 = rootChunk.getChunkAtCoord([6, 1], 3);
  mustNotBeNeigbour = chunkDepth_3.isMyNeigbour(chunkDepth_1);
  assert.false(mustNotBeNeigbour, 'Chunks are not neigbour (small vs big)');

  mustNotBeNeigbour = chunkDepth_1.isMyNeigbour(chunkDepth_3);
  assert.false(mustNotBeNeigbour, 'Chunks are not neigbour (big vs small)');

  const chunkDepth_2A = rootChunk.getChunkAtCoord([0, 2], 2);
  let chunkDepth_2B = rootChunk.getChunkAtCoord([0, 3], 2);
  mustBeNeigbour = chunkDepth_2A.isMyNeigbour(chunkDepth_2B);
  assert.true(mustBeNeigbour, 'Chunks are neigbour (same depth)');

  chunkDepth_2B = rootChunk.getChunkAtCoord([2, 3], 2);
  mustNotBeNeigbour = chunkDepth_2A.isMyNeigbour(chunkDepth_2B);
  assert.false(mustNotBeNeigbour, 'Chunks are not neigbour (same depth)');
});