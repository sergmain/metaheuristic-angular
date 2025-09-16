import {Routes} from '@angular/router';
import {AddFunctionComponent} from './add-function/add-function.component';
import {FunctionsComponent} from './functions/functions.component';


export const FUNCTIONS_ROUTES: Routes = [
    {
        path: '',
        component: FunctionsComponent,
    }, {
        path: 'add',
        component: AddFunctionComponent,
        data: {
            backConfig: ['../']
        }
    }
];
