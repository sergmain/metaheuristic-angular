import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService, AuthenticationServiceEventChange, AuthenticationServiceEventLogout } from '@services/authentication';
import { BatchExecStatusService } from '@services/batch/BatchExecStatusService';
import { SettingsService, SettingsServiceEventChange } from '@services/settings/settings.service';
import {HttpClient} from '@angular/common/http';
import {first, interval, Subscription} from 'rxjs';
import {environment} from '@src/environments/environment';
import {RuntimeService} from '@services/runtime/runtime.service';

const statusUrl = environment.baseUrl+'dispatcher/anon/ping'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent extends UIStateComponent implements OnInit, OnDestroy {

    private source = interval(500);

    constructor(
        private translate: TranslateService,
        private batchExexStatusService: BatchExecStatusService,
        readonly authenticationService: AuthenticationService,
        private settingsService: SettingsService,
        private runtimeService: RuntimeService,
        private _http: HttpClient
    ) {
        super(authenticationService);

        const subscribe: Subscription = this.source.subscribe(() => {
            this._http
                .get(statusUrl, { observe: 'response' })
                .pipe(first())
                .subscribe({
                    next: resp => {
                        //console.log("next, status: ", resp.status);
                        if (resp.status>=200 && resp.status<500) {
                            runtimeService.setServerReady(statusUrl)
                        }
                        // else {
                        //     console.log("next:", false);
                        // }
                        subscribe.unsubscribe();
                    },
                    error: resp => {
                        // console.log("error, status: ", resp.status);
                        if (resp.status>=200 && resp.status<500) {
                            runtimeService.setServerReady(statusUrl)
                            subscribe.unsubscribe();
                        }
                        // else {
                        //     console.log("error:", false);
                        // }
                    }
                });
        });
    }

    ngOnInit(): void {
        this.subscribeSubscription(
            this.settingsService.events.subscribe(event => {
                if (event instanceof SettingsServiceEventChange) {
                    this.translate.use(event.settings.language);
                }
            })
        );

        this.subscribeSubscription(
            this.authenticationService.events.subscribe(event => {
                if (event instanceof AuthenticationServiceEventChange) {
                    if (event.user) {
                        this.batchExexStatusService.startIntervalRequset();
                    }
                }

                if (event instanceof AuthenticationServiceEventLogout) {
                    this.batchExexStatusService.stopIntervalRequset();
                }
            })
        );
    }
    ngOnDestroy(): void { this.unsubscribeSubscriptions(); }
}