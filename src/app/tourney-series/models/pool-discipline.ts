export enum PoolDiscipline {
    EightBall,
    NineBall,
    TenBall,
    StraightPool,
    OnePocket,
    BankPool
}

export class PoolDisciplineMapper {

    private static _strings = [
        '8-Ball',
        '9-Ball',
        '10-Ball',
        '14/1',
        'One-Pocket',
        'Bank-Pool'];

    static map(discipline: PoolDiscipline): string {
        return this._strings[discipline];
    }

    static mapToEnum(value: string): PoolDiscipline {
        const index = this._strings.indexOf(value);
        if (index < 0 || index > 5) {
            throw Error('Cannot map ' + value + ' to a PoolDiscipline.');
        }
        return index;
    }

    static getAllValues(){
        return this._strings;
    }
}
