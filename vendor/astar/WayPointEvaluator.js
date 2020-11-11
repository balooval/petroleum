const WHITE_CHUNK_VALUE = 0;
const BLACK_CHUNK_VALUE = 1;

class BasicWayPointEvaluator {
    constructor() {
        
    }
    
    evaluate(_waypoint, _destinationWayPoint) {
        let practicability = 1;
        if (_waypoint.chunk.value == BLACK_CHUNK_VALUE) {
            practicability = 0.00001;
        }
        const distance = calcDistance(_waypoint, _destinationWayPoint);
        const cost = distance / practicability;
        return cost;
    }
}

function calcDistance(_waypoint, _destinationWayPoint) {
    const destinationChunk = _destinationWayPoint.chunk;
    const distanceToEnd = _waypoint.chunk.getDistanceToChunk(destinationChunk);
    const distance = _waypoint.distanceFromStart + distanceToEnd;
    return distance;
}

export {BasicWayPointEvaluator as default};