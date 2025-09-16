import {Routes} from '@angular/router';
import {EvaluationsComponent} from './evaluations/evaluations.component';
import {EvaluationAddComponent} from './evaluation-add/evaluation-add.component';

export const EVALUATION_ROUTES: Routes = [
    {
        path: '',
        component: EvaluationsComponent
    },
    {
        path: 'add',
        component: EvaluationAddComponent,
        data: {
            backConfig: ['../']
        }
    }
];
