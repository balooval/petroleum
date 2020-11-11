import * as math from '../app/math.js';

QUnit.module('Math');

QUnit.test('Direction into limits', assert => {
    const limit = 10;
    const direction = math.randomDirection(limit);
    const underMax = direction <= limit;
    const overMin = direction >= (limit * -1);
    assert.isUnder(direction, limit, 'Direction is under high limit');
    assert.isOver(direction, limit * -1, 'Direction is over low limit');
});