import {DefaultResponse} from '@app/models/DefaultResponse';
import {SimpleScenarioGroup} from '@services/scenario/SimpleScenarioGroup';
import {PageableDefault} from '@app/models/PageableDefault';

export interface SimpleScenarioGroupsResult extends DefaultResponse {
    scenarioGroups: {
        content: SimpleScenarioGroup[];
    } & PageableDefault;
}

export interface SimpleScenarioGroupsAllResult extends DefaultResponse {
    scenarioGroups: SimpleScenarioGroup[];
}