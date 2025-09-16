import {Routes} from '@angular/router';
import {GlobalVariablesComponent} from './global-variables/global-variables.component';
import {AddGlobalVariableComponent} from './add-global-variable/add-global-variable.component';


export const GLOBAL_VARIABLES_ROUTES: Routes = [
    {
        path: '',
        component: GlobalVariablesComponent
    },
    {
        path: 'add',
        component: AddGlobalVariableComponent,
        data: {
            backConfig: ['../']
        }
    },
    {
        path: ':id',
        component: GlobalVariablesComponent,
        data: {
            backConfig: ['../']
        }
    },
];

