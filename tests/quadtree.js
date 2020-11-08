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

QUnit.test('Build bloc', assert => {
  const rootBloc = Quadtree.build(datas);
  assert.true(rootBloc instanceof Quadtree.Bloc, 'Return Bloc');
});

QUnit.test('Get bloc at position', assert => {
  const rootBloc = Quadtree.build(datas);
  const targetBloc = rootBloc.getBlocAtPosition(5, 3);
  assert.true(targetBloc instanceof Quadtree.Bloc, 'Bloc found');
  assert.equal(targetBloc.x, 5, 'X is correct');
  assert.equal(targetBloc.y, 3, 'Y is correct');
  assert.equal(targetBloc.childrens.length, 0, 'No childrens');
});

QUnit.test('Get no bloc at position', assert => {
  const rootBloc = Quadtree.build(datas);
  const returnedBloc = rootBloc.getBlocAtPosition(54, -50);
  assert.equal(returnedBloc, null, 'Found no bloc outside');
});


QUnit.test('Search bloc by coord', assert => {
  const rootBloc = Quadtree.build(datas);
  const child = rootBloc.getBlocAtCoord([4, 3], 3);
  assert.true(child instanceof Quadtree.Bloc, 'Bloc found');
});

QUnit.test('Convert coord', assert => {
  const rootBloc = Quadtree.build(datas);
  const convertedCoordToSmallerDepth = rootBloc.convertCoordToSmallerDepth([5, 1], 3, 2)
  assert.deepEqual(convertedCoordToSmallerDepth, [2, 0], 'Coord converted to smaller depth');
  const convertedCoordToHigherDepth = rootBloc.convertCoordToSmallerDepth([2, 0], 2, 3)
  assert.notOk(convertedCoordToHigherDepth, 'Coord converted to higher depth is null');
});

QUnit.test('Search bloc neighbours', assert => {
  const rootBloc = Quadtree.build(datas);
  const childA = rootBloc.getBlocAtCoord([3, 2], 3);
  console.log('childA', childA);
  const childB = rootBloc.getBlocAtCoord([4, 3], 3);
  const mustBeNeigbour = childB.isMyNeigbour(childA);
  assert.true(mustBeNeigbour, 'Blocs are neigbour');

  const childC = rootBloc.getBlocAtCoord([6, 5], 3);
  const mustNotBeNeigbour = childC.isMyNeigbour(childA);
  assert.false(mustNotBeNeigbour, 'Blocs are not neigbour');

  const childD = rootBloc.getBlocAtCoord([6, 1], 3);
  console.log('childD', childD);
  const mustNotBeNeigbourB = childD.isMyNeigbour(childA);
  assert.false(mustNotBeNeigbourB, 'Blocs are not neigbour');
});