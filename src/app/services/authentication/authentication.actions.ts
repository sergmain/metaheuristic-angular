import { createAction, props } from '@ngrx/store';
import { User } from './User';

function named(name: string) { return `[Authentication] ${name}`; }

export const initional = createAction(named('Initional'));
export const initionalComplete = createAction(named('Initional Complete'), props < { payload: User } > ());

export const logout = createAction(named('Logout'));
export const logoutComplete = createAction(named('Logout Complete'));

export const login = createAction(named('Login'), props < { username: string, password: string } > ());
export const loginComplete = createAction(named('Login Complete'), props < { payload: User } > ());