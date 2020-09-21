import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';
import { TranslateModule } from '@ngx-translate/core';
import { CtModule } from '../ct/ct.module';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { CopyRightModule } from '../copy-right/copy-right.module';
import { AiIndexComponent } from './ai-index/ai-index.component';
import { AiRootComponent } from './ai-root/ai-root.component';


const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: AiRootComponent,
        children: [{
            path: '',
            component: AiIndexComponent
        }]
    },
    {
        path: 'experiments',
        canActivate: [AuthGuard],
        component: AiRootComponent,
        loadChildren: () => import('src/app/modules/experiments/experiments.module').then(m => m.ExperimentsModule),
        data: { section: 'experiments' }
    },
    {
        path: 'experiment-result',
        canActivate: [AuthGuard],
        component: AiRootComponent,
        loadChildren: () => import('@src/app/modules/experiment-result/experiment-result.module').then(m => m.ExperimentResultModule),
        data: { section: 'experiment-result' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})
export class AiRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        AiRoutingModule,
        CtModule,
        CopyRightModule,
        MaterialAppModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        AiIndexComponent,
        AiRootComponent
    ]
})
export class AiModule { }