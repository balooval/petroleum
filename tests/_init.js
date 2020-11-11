import './math.js';
import './event.js';
import './motion.js';
import './geometry.js';
import './mapReader.js';
import './entitiesGenerator.js';
import './quadtree.js';
import './graphTree.js';
import './astar.js';

QUnit.assert.isUnder = function(a, b, message ) {
    this.pushResult( {
        result: a < b,
        actual: a,
        expected: b,
        message: message
    });
};

QUnit.assert.isOver = function(a, b, message ) {
    this.pushResult( {
        result: a > b,
        actual: a,
        expected: b,
        message: message
    });
};