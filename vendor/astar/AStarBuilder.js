import AStar from './astar.js';
import BasicEvaluator from './WayPointEvaluator.js';

class AStarBuilder {

    constructor() {
        this.reset();
    }
    
    reset() {
        this.graph = null;
        this.start = null;
        this.end = null;
        this.evaluator = new BasicEvaluator();
        return this;
    }

    build() {
        const resolver = new AStar();
        resolver.loadGraph(this.graph);
        resolver.setup(this.start, this.end, this.evaluator);
        return resolver;
    }

    withGraph(_graph) {
        this.graph = _graph;
        return this;
    }

    withStart(_start) {
        this.start = _start;
        return this;
    }

    withEnd(_end) {
        this.end = _end;
        return this;
    }

    withEvaluator(_evaluator) {
        this.evaluator = _evaluator;
        return this;
    }
}

export {AStarBuilder as default};