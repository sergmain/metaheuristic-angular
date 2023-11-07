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

export interface ChatsAllResult extends DefaultResponse {
    chats: SimpleChat[];
}

export interface ChatPrompt {
    prompt: string;
    result: string;
    raw: string;
    error: string;
}

export interface FullChat extends DefaultResponse {
    sessionId: string;
    chatId: string;
    chatName: string;
    apiUid: ApiUid;
    prompts: ChatPrompt[];
}

export interface ApiForCompany extends DefaultResponse {
    apis: ApiUid[];
}

export interface AssetsForChatting extends DefaultResponse {
    api: ApiUid;
}
