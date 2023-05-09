import { DefaultResponse } from '@app/models/DefaultResponse';
import { PageableDefault } from '@app/models/PageableDefault';
import { SimpleScenarioGroup } from "./SimpleScenarioGroup";

export interface SimpleScenarioGroupsResult extends DefaultResponse {
    scenarioGroups: {
        content: SimpleScenarioGroup[];
    } & PageableDefault;
}
