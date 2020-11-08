
const offsetsNeigbour = [
	[-1, 0],
	[0, -1],
	[1, 0],
	[0, 1],
];


export function build(_rootBloc) {
    const finalsBlocs = getFinalsBlocs(_rootBloc, []);
    finalsBlocs.forEach(bloc => calcBlocNeigbours(_rootBloc, bloc));
}

function calcBlocNeigbours(_rootBloc, _bloc) {
    offsetsNeigbour.forEach(offset => {
        const coordNeigbour = [
            _bloc.coord[0] + offset[0],
            _bloc.coord[1] + offset[1],
        ];
        const neigbour = _rootBloc.getBlocAtCoord(coordNeigbour, _bloc.depth);
        if (!neigbour) {
            return;
        }
        if (_bloc.isMyNeigbour(neigbour)) {
            _bloc.addNeigbour(neigbour);
            neigbour.addNeigbour(_bloc);
        }
    });
}

function getFinalsBlocs(_bloc, _values) {
    if (_bloc.childrens.length === 0) {
        _values.push(_bloc);
    }
    _bloc.childrens.forEach(bloc => {
        getFinalsBlocs(bloc, _values)
    });
    return _values;
}