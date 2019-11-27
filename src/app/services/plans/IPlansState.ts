import { IPlan } from './IPlan';
import { response } from './response';

export interface IPlansState {
    getPlansResponse: response.plans.Get;
    getWorkbooksResponse: response.workbooks.Get;
    getPlanResponse: response.plan.Get;
}