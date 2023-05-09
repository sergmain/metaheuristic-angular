import {DefaultResponse} from '@app/models/DefaultResponse';
import {ApiUid} from "./ApiUid";
import {ChapterUid} from "./ChapterUid";

export interface EvaluationUidsForCompany extends DefaultResponse {
    apis: ApiUid[];
    chapters: ChapterUid[];
}