import * as Quadtree from '../app/quadtree.js';
import * as GraphTree from '../app/graphTree.js';

QUnit.module('GraphTree');

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

QUnit.test('Build graph', assert => {
  const rootChunk = Quadtree.build(datas);
  GraphTree.build(rootChunk);
  
  const chunk = rootChunk.getChunkAtCoord([3, 4], 3);
  assert.equal(chunk.neigbours.length, 4, 'Chunks has 4 neigbour');

  let expectedNeigbour = rootChunk.getChunkAtCoord([2, 4], 3);
  let someNeigbour = chunk.neigbours[0];
  assert.equal(expectedNeigbour, someNeigbour, 'First (same depth) neigbour is valid');
  
  expectedNeigbour = rootChunk.getChunkAtCoord([0, 0], 1);
  someNeigbour = chunk.neigbours[1];
  assert.equal(expectedNeigbour, someNeigbour, 'Second (lower depth) neigbour is valid');

  expectedNeigbour = rootChunk.getChunkAtCoord([0, 0], 1);
  assert.equal(expectedNeigbour.neigbours[6], chunk, 'Neigbourhood is reciproque with lower depth');
});
