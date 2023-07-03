import {DefaultResponse} from '@app/models/DefaultResponse';
import {PageableDefault} from '@app/models/PageableDefault';
import {ApiUid} from '@app/modules/api/api-data';

export interface SimpleChat {
    chatId: number;
    name: string;
    createdOn: number;
    apiUid: ApiUid;
}

export interface ChatsResult extends DefaultResponse {
    chats: {
        content: SimpleChat[];
    } & PageableDefault;
}

export interface ChatPrompt {
    id: number;
    prompt: string;
    answer: string;
}

export interface FullChat extends DefaultResponse {
    sessionId: string;
    prompts: ChatPrompt[];
}

export interface ApiForCompany extends DefaultResponse {
    apis: ApiUid[];
}
