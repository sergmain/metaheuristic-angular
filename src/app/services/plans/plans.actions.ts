import { createAction, props } from '@ngrx/store';
import { IPlansState } from './IPlansState';
import { IPlan } from './IPlan';
import { response } from './response';

function named(name: string) { return `[Plans] ${name}`; }

export const getPlans = createAction(named('Get Plans'), props < { pageNumber: number } > ());
export const getPlansSuccess = createAction(named('Get Plans Success'), props < { payload: response.plans.Get } > ());

export const getPlan = createAction(named('Get Plan'), props < { id: string } > ());
export const getPlanSuccess = createAction(named('Get Plan Success'), props < { payload: response.plan.Get } > ());

export const getWorkbooks = createAction(named('Get Workbooks'), props < { planId: string, pageNumber: number } > ());
export const getWorkbooksSuccess = createAction(named('Get Workbooks Success'), props < { payload: response.workbooks.Get } > ());

export const deleteWorkbook = createAction(named('Delete Workbook'), props < { planId: string, workbookId: string } > ());
export const deleteWorkbookSuccess = createAction(named('Delete Workbook Success'));

export const getWorkbook = createAction(named('Get Workbook'), props < { planId: string, workbookId: string } > ());
export const getWorkbookSuccess = createAction(named('Get Workbook Success'), props < { payload: response.workbook.Get } > ());


export const updated = createAction(named('Updated'));