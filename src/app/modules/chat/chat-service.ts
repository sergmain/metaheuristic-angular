import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@src/environments/environment';
import {Observable} from 'rxjs';
import {OperationStatusRest} from '@app/models/OperationStatusRest';
import {generateFormData} from '@app/helpers/generateFormData';
import {Chats, FullChat} from '@app/modules/chat/chat-data';

const url = (s: string): string => `${environment.baseUrl}dispatcher/chat/${s}`;

@Injectable({ providedIn: 'root' })
export class ChatService {
    constructor(private http: HttpClient) {}

    chats = (page: string): Observable<Chats> =>
        this.http.get<Chats>(url(`chats`), { params: { page } })

    chat(chatId: number): Observable<FullChat> {
        return this.http.get<FullChat>(url(`chat/${chatId}`));
    }

    addChatFormCommit(name: string, description: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(
            url(`chat-add-commit`),
            generateFormData({
                name, description
            })
        );
    }

    chatDeleteCommit(chatId: string): Observable<OperationStatusRest> {
        console.log("Delete chat #"+ chatId);
        return this.http.post<OperationStatusRest>(url(`chat-delete-commit`), generateFormData({ chatId: chatId }));
    }

}