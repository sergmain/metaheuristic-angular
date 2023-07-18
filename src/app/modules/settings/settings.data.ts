import {DefaultResponse} from '@app/models/DefaultResponse';

export class ApiKey {
    name: string;
    value: string;
}

export interface ApiKeysResult extends DefaultResponse {
    openaiKey: string;
    apiKeys: ApiKey[];
}