import {Component, OnInit} from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {UIStateComponent} from '@app/models/UIStateComponent';
import {AuthenticationService} from '@app/services/authentication';
import {ChatsResult, SimpleChat} from '@app/modules/chat-new/chat-data';
import {ChatService} from '@app/modules/chat-new/chat-service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogMethod} from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, DatePipe } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { MatTooltip } from '@angular/material/tooltip';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtTablePaginationComponent } from '../../ct/ct-table-pagination/ct-table-pagination.component';

@Component({
    selector: 'chats-new',
    templateUrl: './chats-new.component.html',
    styleUrls: ['./chats-new.component.scss'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, MatIconButton, RouterLink, MatIcon, CtSectionBodyComponent, CtSectionBodyRowComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatTooltip, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent, DatePipe]
})
// DO NOT REMOVE '-new' FROM NAME OF COMPONENT
export class ChatsNewComponent extends UIStateComponent implements OnInit {
    dataSource: MatTableDataSource<SimpleChat> = new MatTableDataSource<SimpleChat>([]);
    columnsToDisplay: string[] = ['id', 'createdOn', 'name', 'bts'];
    chats: ChatsResult;

    constructor(
        readonly dialog: MatDialog,
        private chatService: ChatService,
        readonly authenticationService: AuthenticationService,
        private router: Router,
        private activatedRoute: ActivatedRoute
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

    toChat(chat: SimpleChat) {
        this.router.navigate(['chat', chat.chatId], { relativeTo: this.activatedRoute });
    }
}