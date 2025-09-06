import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService, AuthenticationServiceEventChange, AuthenticationServiceEventLogout } from '@services/authentication';
import { BatchExecStatusService } from '@services/batch/BatchExecStatusService';
import { SettingsService, SettingsServiceEventChange } from '@services/settings/settings.service';
import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import {first, interval, Observable, of, Subscription, timeout} from 'rxjs';
import {environment} from '@src/environments/environment';
import {RuntimeService} from '@services/runtime/runtime.service';
import {catchError} from 'rxjs/operators';

const statusUrl: string = environment.baseUrl+'dispatcher/anon/ping'
const electronStatusUrl: string = 'http://localhost:64968/status';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent extends UIStateComponent implements OnInit, OnDestroy {

    private subscribeStatus: Subscription = undefined;
    private busy: boolean = false;
    private busyStatus: boolean = false;

    constructor(
        private translate: TranslateService,
        private batchExexStatusService: BatchExecStatusService,
        readonly authenticationService: AuthenticationService,
        private settingsService: SettingsService,
        private runtimeService: RuntimeService,
        private _http: HttpClient
    ) {
        super(authenticationService);

        const subscribe: Subscription = interval(1000).subscribe(() => {
            // console.log("Start querying MH server, this.busy", this.busy)
            if (this.busy) {
                return;
            }
            this.busy = true;
            this._http
                .get(statusUrl, { observe: 'response', responseType: 'text'})
                .pipe(
                    timeout(1000),
                    catchError(e  => {
                        // if (e.status=== 401) {
                        //     return of({status: e.status, body: ''});
                        // }
                        // console.log("pipe() error: ", e);
                        // return of({status: HttpStatusCode.RequestTimeout, body: ''});
                        return of({status: e.status, body: ''});
                    })
                )
                .subscribe({
                    next: resp => {
                        // console.log("MH server status: ", resp.status);
                        if (resp.status===200 || resp.status===401) {
                            subscribe.unsubscribe();
                            if (this.subscribeStatus) {
                                this.subscribeStatus.unsubscribe();
                            }
                            runtimeService.setServerReady(statusUrl)
                        }
                    },
                    error: resp => {
                        // console.log("MH server error status: ", resp.status);
                        if (resp.status===200 || resp.status===401) {
                            subscribe.unsubscribe();
                            if (this.subscribeStatus) {
                                this.busyStatus = true;
                                this.subscribeStatus.unsubscribe();
                            }
                            runtimeService.setServerReady(statusUrl)
                        }
                        // else {
                        //     console.log("error:", resp.error);
                        // }
                    },
                    complete: () => {
                        // console.log("subscribe complete, set busy to false");
                        this.busy = false;
                    }
                });
        });

        if (environment.standalone) {
            this.subscribeStatus = interval(950).subscribe(() => {
                console.log("Start querying Electron server, busyStatus", this.busyStatus)
                if (this.busyStatus) {
                    return;
                }
                this.busyStatus = true;
                this._http
                    .get(electronStatusUrl, {observe: 'response', responseType: 'text' })
                    .pipe(
                        timeout(1000),
                        catchError(e => {
                            return of({status: e.status, body: ''});
                            // return of({status: HttpStatusCode.RequestTimeout, body: ''});
                        })
                    )
                    .subscribe({
                        next: resp => {
                            //console.log("next, status: ", resp.status);
                            if (resp.status===200 || resp.status===401) {
                                runtimeService.setMhStatuses(resp.body);
                            }
                        },
                        complete: () => {
                            // console.log("subscribeStatus complete, set busyStatus to false");
                            this.busyStatus = false;
                        }
                    });
            });
        }
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