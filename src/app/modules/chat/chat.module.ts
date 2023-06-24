import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {CtModule} from '../ct/ct.module';
import {MaterialAppModule} from '@src/app/ngmaterial.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RoleRouteGuard} from '@app/guards/role-route.guard';
import {Role} from '@services/authentication';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatTableModule} from '@angular/material/table';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ChatsComponent} from '@app/modules/chat/chats/chats.component';
import {ChatAddComponent} from '@app/modules/chat/chat-add/chat-add.component';
import {ChatComponent} from '@app/modules/chat/chat/chat.component';

export const ScenarioRoutes: Routes = [
    {
        path: '',
        component: ChatsComponent
    },
    {
        path: 'chat-add',
        component: ChatAddComponent,
        data: {
            backConfig: ['../']
        }
    },
    {
        path: 'chat/:chatId',
        component: ChatComponent,
        canActivate: [RoleRouteGuard],
        data: {
            backConfig: ['../', '../', 'chats'],
            requiredRoles: [Role.Admin]
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(ScenarioRoutes)],
    exports: [RouterModule],
    declarations: []
})
export class ScenarioGroupRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({}),
        DragDropModule,
        MatTableModule,
        FlexLayoutModule
    ],
    declarations: [
        ChatsComponent,
        ChatAddComponent,
        ChatComponent
    ]
})
export class ChatModule { }