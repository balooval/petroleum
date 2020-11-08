import Event from '../app/event.js';

QUnit.module('Event');

QUnit.test('Event addEventListener', assert => {
  let state = 'not fire';
  const listener = {
    onEvent : () => state = 'has fire',
  };
  const evt = new Event();
  evt.addEventListener('TOTO', listener, listener.onEvent);
  assert.equal(state, 'not fire');
  evt.fireEvent('TOTO');
  assert.equal(state, 'has fire');
});

QUnit.test('Event removeEventListener', assert => {
  let hasFired = false;
  const listener = {
    onEvent : () => hasFired = true,
  };
  const evt = new Event();
  evt.addEventListener('TOTO', listener, listener.onEvent);
  evt.removeEventListener('TOTO', listener, listener.onEvent);
  evt.fireEvent('TOTO');
  assert.false(hasFired, 'listener removed');
});

QUnit.test('Event clearEventListener', assert => {
  let hasFired = false;
  const listener = {
    onEvent : () => hasFired = true,
  };
  const evt = new Event();
  evt.addEventListener('TOTO', listener, listener.onEvent);
  evt.clearEventListener(listener);
  evt.fireEvent('TOTO');
  assert.false(hasFired, 'listener clear');
});