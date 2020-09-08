import { Authority } from './Authoritie';
export interface SimpleAccount {
    id: number;
    companyId: number;
    username: string;
    publicName: string;
    enabled: boolean;
    createdOn: number;
    updateOn: number;
    roles: string;
    authorities: Authority[];
}