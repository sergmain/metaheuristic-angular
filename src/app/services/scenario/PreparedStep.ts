import {DefaultResponse} from '@app/models/DefaultResponse';

export interface PreparedStep extends DefaultResponse {
    uuid: string;
    inputs: string[];
    error: string;
}
