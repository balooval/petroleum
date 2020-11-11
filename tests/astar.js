import * as Quadtree from '../app/quadtree.js';
import * as GraphTree from '../app/graphTree.js';
import Builder from '../vendor/astar/AStarBuilder.js';

QUnit.module('AStar');

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

QUnit.test('AStar found path between 2 chunks', assert => {
  const rootChunk = Quadtree.build(datas);
  GraphTree.build(rootChunk);
  const startChunk = rootChunk.getChunkAtCoord([7, 3], 3);
  const endChunk = rootChunk.getChunkAtCoord([3, 3], 2);
  const builder = new Builder();
  const resolver = builder
    .reset()
    .withGraph(rootChunk)
    .withStart(startChunk)
    .withEnd(endChunk)
    .build();
  const path = resolver.launch();
  assert.equal(path.length, 14, 'Path contains 14 waypoints');
  const finalChunk = path[0].chunk;
  assert.equal(finalChunk, endChunk, 'Path finish to final chunk');
});
