import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute} from '@angular/router';
import {UIStateComponent} from '@src/app/models/UIStateComponent';
import {AuthenticationService} from '@src/app/services/authentication';
import {ConfirmationDialogMethod} from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import {MatDialog} from '@angular/material/dialog';
import {ChatService} from '@app/modules/chat/chat-service';
import {Chats, SimpleChat} from '@app/modules/chat/chat-data';

@Component({
    selector: 'chats',
    templateUrl: './chats.component.html',
    styleUrls: ['./chats.component.css']
})
export class ChatsComponent extends UIStateComponent implements OnInit {
    dataSource: MatTableDataSource<SimpleChat> = new MatTableDataSource<SimpleChat>([]);
    columnsToDisplay: string[] = ['id', 'createdOn', 'name', 'bts'];
    chats: Chats;

    constructor(
        readonly dialog: MatDialog,
        private chatService: ChatService,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.updateTable(0);
    }

    updateTable(page: number): void {
        this.setIsLoadingStart();
        this.chatService
            .chats(page.toString())
            .subscribe({
                next: chats => {
                    this.chats = chats;
                    this.dataSource = new MatTableDataSource(this.chats.chats.content || []);
                },
                complete: () => {
                    this.setIsLoadingEnd();
                }
            });
    }

    @ConfirmationDialogMethod({
        question: (ss: SimpleChat): string =>
            `Do you want to delete chat #${ss.chatId}`,

        resolveTitle: 'Delete',
        rejectTitle: 'Cancel'
    })
    delete(chat: SimpleChat): void {
        this.chatService
            .chatDeleteCommit(chat.chatId.toString())
            .subscribe(v => this.updateTable(this.chats.chats.number));
    }

/*
    @ConfirmationDialogMethod({
        question: (ss: SimpleScenario): string =>
            `Do you want to copy Scenario #${ss.scenarioId}, ${ss.name}`,

        resolveTitle: 'Copy scenario',
        rejectTitle: 'Cancel'
    })
    copyScenario(scenario: SimpleScenario) {
        this.chatService
            .copyScenario(scenario.scenarioGroupId.toString(), scenario.scenarioId.toString())
            .subscribe(v => this.updateTable(this.chats.scenarios.number));
    }
*/

    nextPage(): void {
        this.updateTable(this.chats.chats.number + 1);
    }

    prevPage(): void {
        this.updateTable(this.chats.chats.number - 1);
    }

}
