import * as MapReader from '../app/mapReader.js';

QUnit.module('Map Reader');


QUnit.test('Simple shape', assert => {
  const svgContent = '<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ --><g><title>background</title><rect fill="#fff" id="canvas_background" height="602" width="802" y="-1" x="-1"/><g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid"><rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/></g></g><g><title>Layer 1</title><path id="svg_12" d="m19.25263,40.99972l-15.25266,20.99985l2.49998,37.99974l21.49985,-26.49982l-16.49989,34.49976l21.99985,25.99982l53.99963,-11.49992l18.99987,47.49967l65.99954,-4.49997l-11.99992,-20.49986l17.49988,17.99988l12.99991,-50.49965l-31.99978,-45.99968l48.99966,16.49989l-28.9998,-60.99958l-66.99954,-8.99994l3.49998,36.99974l-22.99984,-31.99978l-23.49984,-0.99999l3.99997,28.9998l-17.99988,-25.49982l-16.99988,18.49987l-16.49989,-12.99991l-2.24722,14.9999z" fill-opacity="null" stroke-opacity="null" stroke-width="1.5" stroke="#000" fill="#fff"/></g></svg>';
  const polygons = MapReader.read(svgContent);
  const expected = [[21,26],[37,38],[53,20],[70,45],[67,17],[90,17],[112,48],[109,12],[175,20],[203,80],[155,64],[186,109],[174,159],[157,142],[168,162],[103,166],[85,119],[32,130],[11,105],[27,71],[6,97],[4,60],[19,40]];
  assert.equal(polygons.length, 1, 'Contain 1 shape');
  assert.deepEqual(polygons[0], expected, 'Coords extracted');
});

QUnit.test('Multiple shapes', assert => {
  const svgContent = '<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ --><g><title>background</title><rect fill="#fff" id="canvas_background" height="602" width="802" y="-1" x="-1"/><g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid"><rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/></g></g><g><title>Layer 1</title><path id="svg_1" d="m42.7598,26.99926l-31.26012,41.99885l14.99959,28.49922l20.99942,-19.99945l8.49977,28.49922l50.9986,-38.49894l-37.99896,-41.99885l-26.23831,1.49996z" stroke-width="1.5" stroke="#000" fill="#fff"/><path id="svg_2" d="m127.75747,139.49617l53.23756,6.99981l-34.99904,53.99852l-18.23852,-60.99832z" stroke-width="1.5" stroke="#000" fill="#fff"/><path id="svg_4" d="m183.75594,54.49851l-21.76038,25.4993l27.49925,18.99948l-1.99995,13.49963l14.4996,-12.49966l-1.99995,-34.99904l42.99882,-12.99964l-59.2374,2.49993z" fill-opacity="null" stroke-opacity="null" stroke-width="1.5" stroke="#000" fill="#fff"/></g></svg>';
  const polygons = MapReader.read(svgContent);
  assert.equal(polygons.length, 3, 'Contain 3 shape');
});