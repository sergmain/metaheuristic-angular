import { Authority } from './Authority';

export class User {
    authorities: Authority[];
    publicName: string;
    username: string;
    token: string;

    constructor(data: User) {
        this.publicName = data?.publicName || '';
        this.username = data?.username || '';
        this.authorities = data?.authorities || [];
    }
}