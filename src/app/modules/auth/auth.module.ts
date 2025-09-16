import {Routes} from '@angular/router';
import {AuthsComponent} from './auths/auths.component';
import {AuthEditComponent} from '@app/modules/auth/auth-edit/auth-edit.component';
import {AuthAddComponent} from '@app/modules/auth/auth-add/auth-add.component';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        component: AuthsComponent
    },
    {
        path: 'add',
        component: AuthAddComponent,
        data: {
            backConfig: ['../']
        }
    },
    {
        path: 'params-edit/:authId',
        component: AuthEditComponent,
        data: {
            backConfig: ['../', '../']
        }
    },
];

