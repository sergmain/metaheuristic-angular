import { IPlan } from './IPlan';
import { response } from './response';

export interface IPlansState {
    plans: any;
    plansResponse: response.plans.Get;
    workbooks: any;
    workbooksResponse: response.workbooks.Get;
    getPlanResponse: response.plan.Get;
}