import {Routes} from '@angular/router';
import {AddExecContextComponent} from './add-exec-context/add-exec-context.component';
import {AddSourceCodeComponent} from './add-source-code/add-source-code.component';
import {EditExecContextComponent} from './edit-exec-context/edit-exec-context.component';
import {ExecContextStatesComponent} from './exec-context-states/exec-context-states.component';
import {ExecContextsComponent} from './exec-contexts/exec-contexts.component';
import {SourceCodesComponent} from './source-codes/source-codes.component';
import {ViewSourceCodeComponent} from './view-source-code/view-source-code.component';

export const SOURCE_CODES_ROUTES: Routes = [
    {
        path: '',
        component: SourceCodesComponent,
    },
    {
        path: 'add',
        component: AddSourceCodeComponent,
        data: {
            backConfig: ['../']
        }
    },
    {
        path: ':sourceCodeId/view',
        component: ViewSourceCodeComponent,
        data: {
            backConfig: ['../', '../']
        }
    },
    {
        path: ':sourceCodeId/exec-contexts',
        component: ExecContextsComponent,
        data: {
            backConfig: ['../', '../']
        }
    },
    {
        path: ':sourceCodeId/exec-context/add',
        component: AddExecContextComponent,
    },
    {
        path: ':sourceCodeId/exec-context/:execContextId/edit',
        component: EditExecContextComponent,
        data: {
            backConfig: ['../', '../']
        }
    },
    {
        path: ':sourceCodeId/exec-context/:execContextId/state',
        component: ExecContextStatesComponent,
        data: {
            backConfig: ['../', '../', '../', 'exec-contexts']
        }
    }
];


