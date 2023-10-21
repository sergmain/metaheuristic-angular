import {HttpHeaders} from '@angular/common/http';

export class MhUtils {
    constructor() { }

    static printHeaders(headers: HttpHeaders) {
        if (!headers) {
            console.log("headers: " + headers);
            return;
        }
        let keys = headers.keys();
        for (const key of keys) {
            let values = headers.getAll(key);
            console.log("key: " + key+", values: " + values);
        }
    }

    static isNotNull(obj: any) {
        return !MhUtils.isNull(obj);
    }

    static isNull(obj: any) {
        return obj===null || obj===undefined;
    }

    static isTrue(obj: any) {
        return MhUtils.isNotNull(obj) && obj===true;
    }

    static anyStr(s:string, anyStrs: string[]): boolean {
        for (const ss of anyStrs) {
            if (s===ss) {
                return true;
            }
        }
        return false;
    }

    static len(obj: any) {
        return MhUtils.isNull(obj) || MhUtils.isNull(obj.length) ? 0 : obj.length;
    }

    static randomInt(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    static randomIntAsStr(min, max) { // min and max included
        return MhUtils.randomInt(min, max).toString()
    }



}