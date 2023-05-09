import { DefaultResponse } from '@app/models/DefaultResponse';
import { SimpleScenario } from './SimpleScenario';
import { PageableDefault } from '@app/models/PageableDefault';

export interface ScenariosResult extends DefaultResponse {
    scenarios: {
        content: SimpleScenario[];
    } & PageableDefault;
}