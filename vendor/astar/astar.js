const LOOP_LIMIT = 10000;

class AStar {

	constructor() {
        this.graph = null;
        this.successCallback = null;
        this.reset();
    }
    
    reset() {
        this.evaluator = null;
        this.endWayPoint = null;
        this.open = [];
        this.close = [];
    }

    defaultSuccessCalback() {
        // do nothing
    }
    
    loadGraph(_graph) {
        this.graph = _graph;
    }
    
    setup(_startChunk, _endChunk, _evaluator, _callback) {
        this.reset();
        this.evaluator = _evaluator;
        this.successCallback = _callback || this.defaultSuccessCalback;
        this.endWayPoint = new WayPoint(_endChunk);
        const startWayPoint = new WayPoint(_startChunk);
        this.addToOpen(startWayPoint);
    }

    launch() {
        for (let i = 0; i < LOOP_LIMIT; i ++) {
            const path = this.step();
            if (path !== null) {
                return path;
            }
        }
        console.warn('LOOP_LIMIT EXCEED');
        return [];
    }

    step() {
        const curWayPoint = this.getBestOpen();
        if (this.isFinalWayPoint(curWayPoint)) {
            console.log('END REACH');
            const path = this.buildPath(curWayPoint);
            this.successCallback(path);
            return path;
        }
        if (!curWayPoint) {
            console.log('NO OPEN WAYPOINTS');
            return [];
        }
        this.addToClose(curWayPoint);
        const siblings = this.getSiblings(curWayPoint);
        siblings.forEach(wayPoint => {
            wayPoint.setParent(curWayPoint);
            const cost = this.evaluator.evaluate(wayPoint, this.endWayPoint);
            wayPoint.setCost(cost);
            this.addToOpen(wayPoint);
        });
        return null;
    }

    isFinalWayPoint(_wayPoint) {
        return _wayPoint.chunk == this.endWayPoint.chunk;
    }

    getSiblings(_wayPoint) {
        return _wayPoint.chunk.neigbours.map(chunk => {
            return this.getAvailableWaypoint(chunk);
        }).filter(sibling => sibling)
        .map(wayPoint => {
            wayPoint.parent = _wayPoint;
            return wayPoint;
        });
    }

    getAvailableWaypoint(_chunk) {
        if (this.listContainsChunk(this.open, _chunk)) return null;
        if (this.listContainsChunk(this.close, _chunk)) return null;
        return new WayPoint(_chunk);
    }

    listContainsChunk(_list, _chunk) {
        const matching = _list.filter(wayPoint => {
            return wayPoint.chunk == _chunk;
        })
        return matching.length > 0;
    }

    addToOpen(_wayPoint) {
        this.open.push(_wayPoint);
        this.open = this.open.sort((a, b) => b.cost - a.cost);
    }
    
    addToClose(_wayPoint) {
        _wayPoint.isClosed = true;
        this.close.push(_wayPoint);
    }

    getBestOpen() {
        return this.open.pop();
    }

    buildPath(_wayPoint) {
        const path = [];
        while (_wayPoint) {
            path.push(_wayPoint);
            _wayPoint = _wayPoint.parent;
        }
        return path;
    }

}

class WayPoint {

    constructor(_chunk) {
        this.chunk = _chunk;
        this.parent = null;
        this.cost = 0;
        this.isClosed = false;
        this.distanceFromStart = 0;
    }

    setParent(_parent) {
        this.parent = _parent;
        this.distanceFromStart = this.parent.distanceFromStart + this.chunk.getDistanceToChunk(this.parent.chunk);
    }

    setCost(_cost) {
        this.cost = _cost;
    }
}


export {AStar as default};