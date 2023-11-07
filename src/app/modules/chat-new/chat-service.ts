import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@src/environments/environment';
import {Observable} from 'rxjs';
import {OperationStatusRest} from '@app/models/OperationStatusRest';
import {generateFormData} from '@app/helpers/generateFormData';
import {ApiForCompany, ChatPrompt, ChatsResult, FullChat} from '@app/modules/chat-new/chat-data';

const url = (s: string): string => `${environment.baseUrl}dispatcher/chat/${s}`;

@Injectable({ providedIn: 'root' })
export class ChatService {
    constructor(private http: HttpClient) {}

    chats = (page: string): Observable<ChatsResult> =>
        this.http.get<ChatsResult>(url(`chats`), { params: { page } })

    chatsAll(): Observable<ChatsResult> {
        return this.http.get<ChatsResult>(url(`chats`));
    }

    chat(chatId: string): Observable<FullChat> {
        return this.http.get<FullChat>(url(`chat/${chatId}`));
    }

    chatDeleteCommit(chatId: string): Observable<OperationStatusRest> {
        console.log("Delete chat #"+ chatId);
        return this.http.post<OperationStatusRest>(url(`chat-delete-commit`), generateFormData({ chatId: chatId }));
    }

    chatAdd(): Observable<ApiForCompany> {
        return this.http.get<ApiForCompany>(url(`chat-add`));
    }

    chatAddCommit(name:string, apiId: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(
            url(`chat-add-commit`),
            generateFormData({name, apiId})
        );
    }

    postPrompt(chatId: string, prompt: string): Observable<ChatPrompt> {
        return this.http.post<ChatPrompt>(url(`post-prompt/${chatId}`),
            generateFormData({ prompt: prompt }));
    }

    updateChatInfoFormCommit(chatId: string, name: string) {
        return this.http.post<ChatPrompt>(url(`update-chat-info-commit/${chatId}`),
            generateFormData({ name: name }));
    }
}