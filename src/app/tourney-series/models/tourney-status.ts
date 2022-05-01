export enum TourneyStatus {
    new,
    ongoing,
    completed,
    postProcessed
}

export class TourneyStatusMapper {

    private static _strings = [
        'Neu',
        'Laufend',
        'Abgeschlossen',
        'Abgeschlossen']

    static map(status: TourneyStatus): string {
        return this._strings[status];
    }

    static mapToEnum(value: string): TourneyStatus {
        const index = this._strings.indexOf(value);
        if (index < 0 || index > 5) {
            throw Error('Cannot map ' + value + ' to a TourneyStatus.');
        }
        return index;
    }

    static getAllValues() {
        return this._strings;
    }
}
