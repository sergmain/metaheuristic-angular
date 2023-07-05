import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {UIStateComponent} from '@src/app/models/UIStateComponent';
import {AuthenticationService} from '@src/app/services/authentication';
import {ChatsResult, SimpleChat} from '@app/modules/chat-new/chat-data';
import {ChatService} from '@app/modules/chat-new/chat-service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogMethod} from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';

@Component({
    selector: 'chats-new',
    templateUrl: './chats-new.component.html',
    styleUrls: ['./chats-new.component.scss']
})
// DO NOT REMOVE '-new' FROM NAME OF COMPONENT
export class ChatsNewComponent extends UIStateComponent implements OnInit {
    dataSource: MatTableDataSource<SimpleChat> = new MatTableDataSource<SimpleChat>([]);
    columnsToDisplay: string[] = ['id', 'createdOn', 'name', 'bts'];
    chats: ChatsResult;

    constructor(
        readonly dialog: MatDialog,
        private chatService: ChatService,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService)
    }

    ngOnInit(): void {
        console.log("ChatsNewComponent.ngOnInit()");
        this.updateTable(0);
    }

    updateTable(page: number): void {
        this.setIsLoadingStart();
        this.chatService
            .chats(page.toString())
            .subscribe({
                next: chats => {
                    //console.log("ChatsNewComponent.updateTable() #1", JSON.stringify(chats));
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

    nextPage(): void {
        this.updateTable(this.chats.chats.number + 1);
    }

    prevPage(): void {
        this.updateTable(this.chats.chats.number - 1);
    }


}