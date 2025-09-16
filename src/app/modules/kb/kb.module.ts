import {Routes} from '@angular/router';
import {KbsComponent} from './kbs/kbs.component';
import {KbEditComponent} from '@app/modules/kb/kb-edit/kb-edit.component';
import {KbAddComponent} from '@app/modules/kb/kb-add/kb-add.component';

export const KB_ROUTES: Routes = [
    {
        path: '',
        component: KbsComponent
    },
    {
        path: 'add',
        component: KbAddComponent,
        data: {
            backConfig: ['../']
        }
    },
    {
        path: 'edit',
        component: KbEditComponent,
        data: {
            backConfig: ['../']
        }
    },
];
