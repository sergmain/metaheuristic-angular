import {Routes} from '@angular/router';
import {ExperimentAddComponent} from './experiment-add/experiment-add.component';
import {ExperimentEditComponent} from './experiment-edit/experiment-edit.component';
import {ExperimentsComponent} from './experiments/experiments.component';
import {ExperimentStateComponent} from './experiment-state/experiment-state.component';


export const EXPERIMENTS_ROUTES: Routes = [
    {
        path: '',
        component: ExperimentsComponent
    },
    {
        path: 'add',
        component: ExperimentAddComponent,
        data: {
            backConfig: ['../']
        }
    },
    {
        path: ':experimentId/edit',
        component: ExperimentEditComponent,
        data: {
            backConfig: ['../', '../']
        }
    },
    {
        path: ':experimentId/source-code/:sourceCodeId/exec-context/:execContextId/state',
        component: ExperimentStateComponent,
        data: {
            backConfig: ['../', '../', '../', '../', '../', '../']
        }
    }
];
