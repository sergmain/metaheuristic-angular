import {Routes} from '@angular/router';
import {ChatsNewComponent} from './chats-new/chats-new.component';
import {ChatNewComponent} from '@app/modules/chat-new/chat-new/chat-new.component';
import {ChatNewAddComponent} from '@app/modules/chat-new/chat-new-add/chat-new-add.component';

export const CHAT_NEW_ROUTES: Routes = [
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

