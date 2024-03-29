import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {CtModule} from '@app/modules/ct/ct.module';
import {MaterialAppModule} from '@src/app/ngmaterial.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChatsNewComponent} from './chats-new/chats-new.component';
import {ChatNewComponent} from '@app/modules/chat-new/chat-new/chat-new.component';
import {ChatNewAddComponent} from '@app/modules/chat-new/chat-new-add/chat-new-add.component';

export const chatNewRoutes: Routes = [
    {
        path: '',
        component: ChatsNewComponent
    },
    {
        path: 'chat-add',
        component: ChatNewAddComponent,
        data: {
            backConfig: ['../']
        }
    },
    {
        path: 'chat/:chatId',
        component: ChatNewComponent,
        data: {
            backConfig: ['../', '../']
        }
    }
];


@NgModule({
    imports: [RouterModule.forChild(chatNewRoutes)],
    exports: [RouterModule]
})
export class ChatNewRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        ChatNewRoutingModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        ChatsNewComponent,
        ChatNewAddComponent,
        ChatNewComponent
    ]
})
export class ChatNewModule { }