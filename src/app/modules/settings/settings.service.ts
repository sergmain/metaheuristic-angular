import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@src/environments/environment';
import {Observable} from 'rxjs';
import {OperationStatusRest} from '@app/models/OperationStatusRest';
import {generateFormData} from '@app/helpers/generateFormData';
import {ApiForCompany, ChatPrompt, ChatsResult, FullChat} from '@app/modules/chat-new/chat-data';
import {TokensResult} from '@app/modules/settings/settings.data';

const url = (s: string): string => `${environment.baseUrl}dispatcher/settings/${s}`;

@Injectable({ providedIn: 'root' })
export class SettingsService {
    constructor(private http: HttpClient) {}

    changePasswordCommit(oldPassword:string, newPassword: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(
            url(`change-password-commit`),
            generateFormData({oldPassword, newPassword})
        );
    }

    chats = (page: string): Observable<ChatsResult> =>
        this.http.get<ChatsResult>(url(`chats`), { params: { page } })

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

    postPrompt(chatId: string, prompt: string): Observable<ChatPrompt> {
        return this.http.post<ChatPrompt>(url(`post-prompt/${chatId}`),
            generateFormData({ prompt: prompt }));
    }

    getTokens(): Observable<TokensResult> {
        let newUrl = url('tokens')
        console.log('SettingsService.newUrl: ' + newUrl);
        return this.http.get<TokensResult>(newUrl);
    }

}