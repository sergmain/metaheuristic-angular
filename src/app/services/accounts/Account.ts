import { Authority } from './Authoritie';
export interface Account {
    id: number;
    createdOn: number;
    updateOn: number;
    enabled: boolean;
    publicName: string;
    username: string;
    authorities: Authority[];
}