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
  let child = rootBloc.getBlocAtCoord([4, 3], 3);
  assert.true(child instanceof Quadtree.Bloc, 'Bloc found');

  child = rootBloc.getBlocAtCoord([2, 1], 2);
  assert.notOk(child, 'No bloc (depth too low)');
});

QUnit.test('Convert coord', assert => {
  const rootBloc = Quadtree.build(datas);
  const convertedCoordToSmallerDepth = rootBloc.convertCoordToSmallerDepth([5, 1], 3, 2)
  assert.deepEqual(convertedCoordToSmallerDepth, [2, 0], 'Coord converted to smaller depth');
  const convertedCoordToHigherDepth = rootBloc.convertCoordToSmallerDepth([2, 0], 2, 3)
  assert.notOk(convertedCoordToHigherDepth, 'Coord converted to higher depth is null');
});

QUnit.test('Contain coord', assert => {
  const rootBloc = Quadtree.build(datas);
  const bloc = rootBloc.getBlocAtCoord([0, 0], 1);
  let contain = bloc.containCoordAtDepth([1, 1], 2);
  assert.true(contain, 'Bloc contain coord at depth');
  contain = bloc.containCoordAtDepth([2, 1], 3);
  assert.true(contain, 'Bloc contain coord at depth');
  contain = bloc.containCoordAtDepth([4, 0], 3);
  assert.false(contain, 'Bloc not contain coord at depth');
  contain = bloc.containCoordAtDepth([1, 7], 3);
  assert.false(contain, 'Bloc not contain coord at depth');
  contain = bloc.containCoordAtDepth([4, 4], 3);
  assert.false(contain, 'Bloc not contain coord at depth');
});

QUnit.test('Test if blocs are neighbours', assert => {
  const rootBloc = Quadtree.build(datas);
  const blocDepth_1 = rootBloc.getBlocAtCoord([3, 2], 3);

  let blocDepth_3 = rootBloc.getBlocAtCoord([4, 3], 3);
  let mustBeNeigbour = blocDepth_3.isMyNeigbour(blocDepth_1);
  assert.true(mustBeNeigbour, 'Blocs are neigbour (small vs big)');

  mustBeNeigbour = blocDepth_1.isMyNeigbour(blocDepth_3);
  assert.true(mustBeNeigbour, 'Blocs are neigbour (big vs small)');
  
  blocDepth_3 = rootBloc.getBlocAtCoord([6, 5], 3);
  let mustNotBeNeigbour = blocDepth_3.isMyNeigbour(blocDepth_1);
  assert.false(mustNotBeNeigbour, 'Blocs are not neigbour (small vs big)');

  blocDepth_3 = rootBloc.getBlocAtCoord([6, 1], 3);
  mustNotBeNeigbour = blocDepth_3.isMyNeigbour(blocDepth_1);
  assert.false(mustNotBeNeigbour, 'Blocs are not neigbour (small vs big)');

  mustNotBeNeigbour = blocDepth_1.isMyNeigbour(blocDepth_3);
  assert.false(mustNotBeNeigbour, 'Blocs are not neigbour (big vs small)');

  const blocDepth_2A = rootBloc.getBlocAtCoord([0, 2], 2);
  let blocDepth_2B = rootBloc.getBlocAtCoord([0, 3], 2);
  mustBeNeigbour = blocDepth_2A.isMyNeigbour(blocDepth_2B);
  assert.true(mustBeNeigbour, 'Blocs are neigbour (same depth)');

  blocDepth_2B = rootBloc.getBlocAtCoord([2, 3], 2);
  mustNotBeNeigbour = blocDepth_2A.isMyNeigbour(blocDepth_2B);
  assert.false(mustNotBeNeigbour, 'Blocs are not neigbour (same depth)');
});