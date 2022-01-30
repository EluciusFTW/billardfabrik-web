import { Injectable } from '@angular/core';
import { KeyValuePair } from '../models/key-value-pair';

@Injectable()
export class EnumHelperService {

    constructor() { }

    mapToKeyValuePairs(enu: any): KeyValuePair[] {
        return Object.keys(enu).map(k => this.kvp(enu, k));
    }

    private kvp(enu: any, k: string) {
        return {
            key: k,
            value: enu[k]
        }
    }
}
