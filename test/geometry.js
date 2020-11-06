import * as Geometry from '../app/geometry.js';

QUnit.module('Geometry');

QUnit.test('Map position', assert => {
  const mappedPosition = Geometry.mapPosition([0, 0], [0, 10], 0.5);
  assert.deepEqual(mappedPosition, [0, 5]);
});

QUnit.test('Offset polygon', assert => {
  const polygon = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
  ];
  const result = [
    [
      10.707106781186548,
      -0.7071067811865475
    ],
    [
      10.707106781186548,
      10.707106781186548
    ],
    [
      -0.7071067811865475,
      10.707106781186548
    ],
    [
      -0.7071067811865475,
      -0.7071067811865475
    ]
  ];
  const offset = Geometry.offsetPolygon(polygon, 1);
  assert.deepEqual(offset, result);
});

QUnit.test('Refine polygon', assert => {
  const polygon = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
  ];
  const result = [
    [0, 0],
    [5, 0],
    [10, 0],
    [10, 5],
    [10, 10],
    [5, 10],
    [0, 10],
    [0, 5],
  ];
  const refined = Geometry.refinePolygon(polygon, 1);
  assert.deepEqual(refined, result);
});