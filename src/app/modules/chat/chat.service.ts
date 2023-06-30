import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@src/environments/environment';
import {Observable} from 'rxjs';
import {OperationStatusRest} from '@app/models/OperationStatusRest';
import {generateFormData} from '@app/helpers/generateFormData';
import {ScenariosResult} from '@services/scenario/ScenariosResult';
import {SimpleScenarioSteps} from '@services/scenario/SimpleScenarioSteps';

const url = (s: string): string => `${environment.baseUrl}dispatcher/chat/${s}`;

@Injectable({ providedIn: 'root' })
export class ChatService {
    constructor(private http: HttpClient) {}

    chats = (page: string, scenarioGroupId: string): Observable<ScenariosResult> =>
        this.http.get<ScenariosResult>(url(`chats`), { params: { page } })

    chat(chatId: number): Observable<SimpleScenarioSteps> {
        return this.http.get<SimpleScenarioSteps>(url(`chat/${chatId}`));
    }

    addChatFormCommit(name: string, description: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(
            url(`scenario-group-add-commit`),
            generateFormData({
                name, description
            })
        );
    }


}