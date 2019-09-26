import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatDialog, MatTableDataSource } from '@angular/material';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { LoadStates } from '@app/enums/LoadStates';
import { SnippetsService } from '@app/services/snippets/snippets.service';
import { CtTableComponent } from '@src/app/ct/ct-table/ct-table.component';
import { Snippet, snippets } from '@src/app/services/snippets/response';

@Component({
    selector: 'snippets-view',
    templateUrl: './snippets.component.pug',
    styleUrls: ['./snippets.component.scss']
})

export class SnippetsComponent implements OnInit {
    readonly states: any = LoadStates;
    currentState: Set < LoadStates > = new Set();
    response: snippets.get.Response;
    dataSource = new MatTableDataSource < Snippet > ([]);
    columnsToDisplay: string[] = ['code', 'type', 'params', 'bts'];
    deletedSnippets: (Snippet)[] = [];

    showParams: boolean = false;

    @ViewChild('nextTable') nextTable: MatButton;
    @ViewChild('prevTable') prevTable: MatButton;
    @ViewChild('table') table: CtTableComponent;

    constructor(
        private snippetsService: SnippetsService,
        private dialog: MatDialog
    ) {
        this.currentState.add(this.states.loading);
    }

    ngOnInit() {
        this.updateTable(0);
    }

    updateTable(page: number) {
        // TODO: response не содержит pageable
        // TODO: листание
        this.snippetsService.snippets.get(page)
            .subscribe(
                (response: snippets.get.Response) => {
                    this.response = response;
                    const items: Snippet[] = response.snippets || [];
                    if (items.length) {
                        this.dataSource = new MatTableDataSource(items);
                        this.currentState.add(LoadStates.show);
                    } else {
                        this.currentState.add(LoadStates.empty);
                    }
                    this.currentState.delete(LoadStates.loading);
                }
            );
    }

    @ConfirmationDialogMethod({
        question: (snippet: Snippet): string =>
            `Do you want to delete Snippet\xa0#${snippet.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(snippet: Snippet) {
        this.deletedSnippets.push(snippet);
        this.snippetsService.snippet
            .delete(snippet.id)
            .subscribe();
    }

    next() {
        // this.updateTable(this...items.number + 1);
    }

    prev() {
        // this.updateTable(this...items.number - 1);
    }
}