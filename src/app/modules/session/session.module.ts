import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CtModule } from '../ct/ct.module';
import { MaterialAppModule } from '@app/ngmaterial.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SessionsComponent } from './sessions/sessions.component';
import {RoleRouteGuard} from "@app/guards/role-route.guard";
import {Role} from "@services/authentication";
import {ErrorsComponent} from "@app/modules/session/errors/errors.component";

export const SessionRoutes: Routes = [
    {
        path: '',
        component: SessionsComponent
    },
    {
        path: ':sessionId/errors',
        component: ErrorsComponent,
        canActivate: [RoleRouteGuard],
        data: {
            backConfig: ['../', '../', ''],
            requiredRoles: [Role.Admin]
        }
    },
];


@NgModule({
    imports: [RouterModule.forChild(SessionRoutes)],
    exports: [RouterModule],
    declarations: []
})
export class SessionRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        SessionRoutingModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        SessionsComponent, ErrorsComponent
    ]
})
export class SessionModule { }