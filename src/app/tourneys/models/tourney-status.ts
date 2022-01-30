export enum TourneyStatus {
    new,
    ongoing,
    completed,
    postProcessed
}

export class TourneyStatusMapper {

    _strings = [
        'Neu',
        'Laufend',
        'Abgeschlossen',
        'Abgeschlossen']

    map(status: TourneyStatus): string {
        return this._strings[status];
    }

    mapToEnum(value: string): TourneyStatus {
        const index = this._strings.indexOf(value);
        if (index < 0 || index > 5) {
            throw Error('Cannot map ' + value + ' to a TourneyStatus.');
        }
        return index;
    }

    getAllValues() {
        return this._strings;
    }
}
