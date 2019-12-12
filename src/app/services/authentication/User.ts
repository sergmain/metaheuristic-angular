import { Authority, response } from './response';
import { Role } from './Role';


export class User {
    authorities: Authority[];
    publicName: string;
    username: string;
    token: string;

    constructor(data: response.User) {
        if (!data) {
            data = {} as response.User;
        }
        this.publicName = data.publicName || '';
        this.username = data.username || '';
        this.authorities = data.authorities || [];
    }
}