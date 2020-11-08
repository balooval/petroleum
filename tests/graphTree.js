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
  const rootBloc = Quadtree.build(datas);
  GraphTree.build(rootBloc);
  
  const bloc = rootBloc.getBlocAtCoord([3, 4], 3);
  assert.equal(bloc.neigbours.length, 4, 'Blocs has 4 neigbour');

  let expectedNeigbour = rootBloc.getBlocAtCoord([2, 4], 3);
  let someNeigbour = bloc.neigbours[0];
  assert.equal(expectedNeigbour, someNeigbour, 'First (same depth) neigbour is valid');
  
  expectedNeigbour = rootBloc.getBlocAtCoord([0, 0], 1);
  someNeigbour = bloc.neigbours[1];
  assert.equal(expectedNeigbour, someNeigbour, 'Second (lower depth) neigbour is valid');

  expectedNeigbour = rootBloc.getBlocAtCoord([0, 0], 1);
  assert.equal(expectedNeigbour.neigbours[6], bloc, 'Neigbourhood is reciproque with lower depth');
});
