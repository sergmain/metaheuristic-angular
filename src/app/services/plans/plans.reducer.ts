import { Action, createReducer, on } from '@ngrx/store';
import { IPlansState } from './IPlansState';
import * as actions from './plans.actions';


export const initialState: IPlansState = {
    getPlansResponse: null,
    getWorkbooksResponse: null,
    getPlanResponse: null
};

const reducer = createReducer(
    initialState,
    on(actions.getPlans, (state) => ({ ...state })),
    on(actions.getPlansSuccess, (state, { payload }) => ({ ...state, getPlansResponse: payload })),

    on(actions.getWorkbooks, (state) => ({ ...state })),
    on(actions.getWorkbooksSuccess, (state, { payload }) => ({ ...state, getWorkbooksResponse: payload })),

    on(actions.deleteWorkbook, (state) => ({ ...state })),
    on(actions.deleteWorkbookSuccess, (state) => ({ ...state })),

    on(actions.getPlan, (state) => ({ ...state })),
    on(actions.getPlanSuccess, (state, { payload }) => ({ ...state, getPlanResponse: payload })),
    on(actions.getPlanNull, (state) => ({ ...state, getPlanResponse: null })),

    on(actions.updated, (state) => ({ ...state })),
);

export function plansReducer(state: IPlansState | undefined, action: Action) {
    return reducer(state, action);
}