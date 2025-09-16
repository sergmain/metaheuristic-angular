import {Routes} from '@angular/router';
import {AccountsComponent} from './accounts/accounts.component';
import {AccountAddComponent} from './account-add/account-add.component';
import {AccountAccessComponent} from './account-access/account-access.component';
import {AccountEditComponent} from './account-edit/account-edit.component';
import {AccountEditPassComponent} from './account-edit-pass/account-edit-pass.component';


export const ACCOUNTS_ROUTES: Routes = [
    {
        path: '',
        component: AccountsComponent
    },
    {
        path: 'add',
        component: AccountAddComponent,
        data: {
            backConfig: ['../']
        }
    },
    {
        path: 'access/:accountId',
        component: AccountAccessComponent,
        data: {
            backConfig: ['../', '../']
        }
    },
    {
        path: 'edit/:id',
        component: AccountEditComponent,
        data: {
            backConfig: ['../', '../']
        }
    },
    {
        path: 'edit-password/:id',
        component: AccountEditPassComponent,
        data: {
            backConfig: ['../', '../']
        }
    }
];

