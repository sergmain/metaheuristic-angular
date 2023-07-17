import {DefaultResponse} from '@app/models/DefaultResponse';

export class Token {
    private _id: number;

    name: string;
    value: string;

    constructor(_id: number) {
        this._id = _id;
    }

    get id(): number {
        return this._id;
    }

    set id(id: number) {
        this._id = id;
    }

    setAllDetails(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
}

export interface TokensResult extends DefaultResponse {
    tokens: Token[];
}