export enum TourneyMode {
    GroupsThenSingleElimination,
    DoubleElimination
}

export class TourneyModeMapper {

    private static _strings = [
        'Gruppe + Einfach-K.O.',
        'Doppel-K.O.'
    ];

    static map(mode: TourneyMode): string {
        return this._strings[mode];
    }

    static mapToEnum(value: string): TourneyMode {
        const index = this._strings.indexOf(value);
        if (index < 0 || index > 5) {
            throw Error('Cannot map ' + value + ' to a tourney mode.');
        }
        return index;
    }

    static getAllValues(){
        return this._strings;
    }
}