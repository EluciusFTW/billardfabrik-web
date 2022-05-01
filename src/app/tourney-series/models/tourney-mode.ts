export enum TourneyMode {
    GruopsThenSingleElimination,
    DoubleElimination
}

export class TourneyModeMapper {

    _strings = [
        'Gruppe + Einfach-K.O.',
        'Doppel-K.O.'
    ];

    map(mode: TourneyMode): string {
        return this._strings[mode];
    }

    mapToEnum(value: string): TourneyMode {
        const index = this._strings.indexOf(value);
        if (index < 0 || index > 5) {
            throw Error('Cannot map ' + value + ' to a tourney mode.');
        }
        return index;
    }

    getAllValues(){
        return this._strings;
    }
}