import * as math from '../app/math.js';

QUnit.module('Math');

QUnit.test('Direction into limits', assert => {
    const limit = 10;
    const direction = math.randomDirection(limit);
    const underMax = direction <= limit;
    const overMin = direction >= (limit * -1);
    assert.true(overMin, 'Over min');
    assert.true(underMax, 'Under max');
});