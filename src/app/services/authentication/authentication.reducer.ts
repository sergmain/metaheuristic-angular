import { Action, createReducer, on } from '@ngrx/store';
import {
    initionalComplete,
    initional,
    logout,
    logoutComplete,
    login,
    loginComplete
} from './authentication.action';
import { User } from './User';


export const initialState: any = {};

const reducer = createReducer(
    initialState,
    on(initional, (user: User) => ({ ...user })),
    on(initionalComplete, (user: User, { payload }) => ({ ...user, ...payload })),
    on(logout, (user: User) => ({ ...user })),
    on(logoutComplete, (user: User) => null),
    on(login, (user: User) => ({ ...user })),
    on(loginComplete, (user: User, { payload }) => ({ ...user, ...payload })),


);

export function authenticationReducer(state: User, action: Action) {
    return reducer(state, action);
}