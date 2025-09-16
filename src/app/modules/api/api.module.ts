import {Routes} from '@angular/router';
import {ApisComponent} from './apis/apis.component';
import {ApiAddComponent} from '@app/modules/api/api-add/api-add.component';

export const API_ROUTES: Routes = [
    {
        path: '',
        component: ApisComponent
    },
    {
        path: 'add',
        component: ApiAddComponent,
        data: {
            backConfig: ['../']
        }
    },
];
