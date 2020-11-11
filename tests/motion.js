import * as Motion from '../app/motion.js';

QUnit.module('Motion');

QUnit.test('With null speed dont move after time', assert => {
  const motion = new Motion.Speed();
  const value = motion.getValueAt(100);
  assert.equal(value, 0, 'Position is same after elapsed time');
});

QUnit.test('With positiv speed has moved after time', assert => {
  const motion = new Motion.Speed(0, 2);
  const value = motion.getValueAt(100);
  assert.equal(value, 200, 'Position has changed');
});

QUnit.test('Some accel', assert => {
  const motion = new Motion.Accel();
  motion.accel = 0.1;
  const value = motion.getValueAt(10);
  assert.equal(value, 5, 'Value OK');
  const speed = motion.getSpeedAt(10);
  assert.equal(speed, 1, 'Speed OK');
  const time = motion.getTimeBySpeed(1);
  assert.equal(time, 10, 'Time OK');
});