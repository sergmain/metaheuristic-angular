import {Component, OnInit, ViewChild} from '@angular/core';
import {LoadStates} from '@app/enums/LoadStates';
import {DefaultResponse} from '@app/models/DefaultResponse';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@services/api/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {Token, TokensResult} from '@app/modules/settings/settings.data';
import {SettingsService} from '@app/modules/settings/settings.service';
import {OperationStatus} from '@app/enums/OperationStatus';
import {MatTableDataSource} from '@angular/material/table';
import {UIStateComponent} from '@app/models/UIStateComponent';
import {AuthenticationService} from '@services/authentication';
import {FunctionEntity} from '@services/functions/FunctionEntity';

@Component({
    selector: "settings-tokens-index",
    templateUrl: './settings-tokens-index.component.html',
    styleUrls: ['./settings-tokens-index.component.scss'],
})
export class SettingsTokensIndexComponent extends UIStateComponent implements OnInit {
    dataSource = new MatTableDataSource<Token>([]);
    response: DefaultResponse;
    status: string;

    tokens: TokensResult;
    token:Token;

    tokenForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        value: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });

    constructor(
        private settingsService: SettingsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService);
        this.token = new Token(0);
    }

    ngOnInit() {
        this.updateTable(0);
    }

    updateTable(page: number) {
        this.setIsLoadingStart();
        this.settingsService
            .getTokens()
            .subscribe({
                next: tokensResult => {
                    this.tokens = tokensResult;
                    this.dataSource = new MatTableDataSource(tokensResult.tokens);
                },
                complete: () => {
                    this.setIsLoadingEnd();
                }
            });
    }

/*
    create(): void {
        this.settingsService
            .changePasswordCommit(this.tokenForm.value.oldPassword, this.tokenForm.value.newPassword)
            .subscribe({
                next: result => {
                    this.status = result.status === OperationStatus.OK ? 'Password was changed successfully.' : result.errorMessagesAsStr;
                },
                complete: () => {
                    this.tokenForm.reset()
                }
            });
    }

*/
    notToCreate() {
        return this.tokenForm.invalid;
    }
}
