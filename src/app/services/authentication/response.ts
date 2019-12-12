import { Role } from './Role';

export namespace response {
    export interface User {
        authorities: Authority[];
        publicName: string;
        username: string;
    }
}


export interface Authority {
    authority: Role;
}