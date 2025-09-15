import {Component, OnInit} from '@angular/core';
import {DefaultResponse} from '@app/models/DefaultResponse';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {ApiKey, ApiKeysResult} from '@app/modules/settings/settings.data';
import {SettingsService} from '@app/modules/settings/settings.service';
import {MatTableDataSource} from '@angular/material/table';
import {UIStateComponent} from '@app/models/UIStateComponent';
import {AuthenticationService} from '@services/authentication';
import {OperationStatus} from '@app/enums/OperationStatus';
import {MhUtils} from '@services/mh-utils/mh-utils.service';
import {Subscription} from 'rxjs';
import { CtSectionComponent } from '../../../ct/ct-section/ct-section.component';
import { CtSectionBodyComponent } from '../../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../../ct/ct-section-body-row/ct-section-body-row.component';
import { NgIf } from '@angular/common';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { CtColsComponent } from '../../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../../ct/ct-col/ct-col.component';
import { CtSectionHeaderComponent } from '../../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../../ct/ct-heading/ct-heading.component';
import { CtSectionFooterComponent } from '../../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: "settings-api-keys-index",
    templateUrl: './settings-api-keys-index.component.html',
    styleUrls: ['./settings-api-keys-index.component.scss'],
    imports: [CtSectionComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatIconButton, MatTooltip, MatIcon, CtColsComponent, CtColComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, RouterLink, TranslateModule]
})
export class SettingsApiKeysIndexComponent extends UIStateComponent implements OnInit {
    protected readonly MhUtils = MhUtils;

    dataSource = new MatTableDataSource<ApiKey>([]);
    response: DefaultResponse;
    status: string;

    apiKeys: ApiKeysResult;
    editingOpenai: boolean;

    predefinedApiKeyForm = new FormGroup({
        openaiKey: new FormControl('', [Validators.required, Validators.minLength(10)]),
    });

    customApiKeyForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        value: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });

    constructor(
        private readonly settingsService: SettingsService,
        readonly authenticationService: AuthenticationService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) {
        super(authenticationService);
    }

    ngOnInit() {
        this.updateTable();
    }

    updateTable() {
        this.setIsLoadingStart();
        this.settingsService
            .getApiKeys()
            .subscribe({
                next: apiKeysResult => {
                    this.apiKeys = apiKeysResult;
                    this.dataSource = new MatTableDataSource(apiKeysResult.apiKeys);
                },
                complete: () => {
                    this.setIsLoadingEnd();
                }
            });
    }

    createKey(): void {
        this.settingsService
            .createApiKeyCommit(this.customApiKeyForm.value.name, this.customApiKeyForm.value.value)
            .subscribe({
                next: result => {
                    this.status = result.status === OperationStatus.OK ? 'Password was changed successfully.' : result.errorMessagesAsStr;
                },
                complete: () => {
                    this.customApiKeyForm.reset()
                }
            });
    }

    startEditingOpenaiKey() {
        this.predefinedApiKeyForm = new FormGroup({
            openaiKey: new FormControl(this.apiKeys.openaiKey, [Validators.required, Validators.minLength(10)]),
        });
        this.editingOpenai = true;
    }

    editFormActive() {
        return this.editingOpenai || MhUtils.isNull(this.apiKeys) || MhUtils.isNull(this.apiKeys.openaiKey);
    }

    notToCreatePredefinedForm() {
        return this.predefinedApiKeyForm.invalid;
    }

    notToCreateCustomForm() {
        return this.customApiKeyForm.invalid;
    }

    saveOpenaiKey() {
        this.setIsLoadingStart();
        const subscribe: Subscription = this.settingsService
            .saveOpenaiKey(
                this.predefinedApiKeyForm.value.openaiKey
            )
            .subscribe({
                    next: (response)=> {
                        if (response.status === OperationStatus.OK) {
                            this.apiKeys.openaiKey = this.predefinedApiKeyForm.value.openaiKey;
                            this.dataSource = new MatTableDataSource(this.apiKeys.apiKeys);
                            //this.router.navigate(['../'], {relativeTo: this.activatedRoute});
                        }
                    },
                    complete: ()=> {
                        this.setIsLoadingEnd();
                        subscribe.unsubscribe();
                    }
                }
            );

        this.editingOpenai = false;
    }

    cancelEditingOpenaiKey() {
        this.editingOpenai = false;
    }
}
