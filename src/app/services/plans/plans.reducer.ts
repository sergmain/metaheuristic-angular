import { Action, createReducer, on } from '@ngrx/store';
import { IPlansState } from './IPlansState';
import * as actions from './plans.actions';


export const initialState: IPlansState = {
    plans: {},
    plansResponse: null,
    workbooks: {},
    workbooksResponse: null,
    getPlanResponse: null
};

const reducer = createReducer(
    initialState,
    on(actions.getPlans, (state) => ({ ...state })),
    on(actions.getPlansSuccess, (state, { payload }) => ({ ...state, plansResponse: payload })),

    on(actions.getWorkbooks, (state) => ({ ...state })),
    on(actions.getWorkbooksSuccess, (state, { payload }) => ({ ...state, workbooksResponse: payload })),

    on(actions.deleteWorkbook, (state) => ({ ...state })),
    on(actions.deleteWorkbookSuccess, (state) => ({ ...state })),

    on(actions.getPlan, (state) => ({ ...state })),
    on(actions.getPlanSuccess, (state, { payload }) => ({ ...state, getPlanResponse: payload })),

    on(actions.updated, (state) => ({ ...state })),
);

export function plansReducer(state: IPlansState | undefined, action: Action) {
    return reducer(state, action);
}