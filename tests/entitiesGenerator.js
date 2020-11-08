import * as Stepper from '../app/stepper.js';
import * as EntitiesGenerator from '../app/entitiesGenerator.js';

QUnit.module('Entitie generator');

QUnit.test('Generate at step', assert => {
    let mockTime = 0.5;
    const mockClock = {
        start : () => true,
        getElapsedTime : () => mockTime,
    };
    Stepper.init(mockClock);
    let entitieGenerated = false;
    EntitiesGenerator.init(60, () => entitieGenerated = true);
    EntitiesGenerator.start();
    Stepper.update();
    assert.false(entitieGenerated, 'Entitie not generated')
    mockTime = 2;
    Stepper.update();
    assert.true(entitieGenerated, 'Entitie was generated')
});
