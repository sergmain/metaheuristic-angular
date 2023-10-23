import {HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
// import * as contentDisposition from 'content-disposition';

// noinspection UnnecessaryLocalVariableJS
@Injectable({ providedIn: 'root' })
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

    static parseContentDisposition(headers, defaultName: string): string {
        let cd = headers.get('Content-Disposition');
        if (!cd) {
            return defaultName;
        }
        // var disposition = contentDisposition.parse(cd);
        // console.log(disposition);

        // Angular 12 with parsing of the file name - https://stackoverflow.com/a/75608515/2672202
        // const fileName = headers
        //     .get('Content-Disposition')
        //     .split(';')
        //     .map(h => h.trim())
        //     .filter(h => h.startsWith('filename='))
        //     .reduce(h => h.length === 1 ? h[0] : defaultName)
        //     .replace('filename=', '');

        // return fileName;
        return defaultName;
    }


}