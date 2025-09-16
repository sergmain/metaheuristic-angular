import {Routes} from '@angular/router';
import {EditProcessorComponent} from './edit-processor/edit-processor.component';
import {ProcessorsComponent} from './processors/processors.component';


export const PROCESSORS_ROUTES: Routes = [
    {
        path: '',
        component: ProcessorsComponent
    },
    {
        path: ':id/edit',
        component: EditProcessorComponent,
        data: {
            backConfig: ['../', '../']
        }
    }
];
