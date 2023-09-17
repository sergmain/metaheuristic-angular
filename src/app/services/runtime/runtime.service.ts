import {Injectable} from '@angular/core';
import {environment} from '@src/environments/environment';
import {AuthenticationService} from '@services/authentication';
import {BehaviorSubject} from 'rxjs';

enum Stage { metaheuristic="metaheuristic", tomcat="tomcat", datasource="datasource", liquibase="liquibase"}

export enum Status { none="none", started="started", done="done", error="error"}

export interface MhStatus {
    stage: string;
    status: Status;
}

export interface MhStatusRaw {
    stage: string;
    status: string;
    error: string;
}

export class MhStatuses {
    constructor(statuses: MhStatus[], error: string) {
        this.statuses = statuses;
        this.error = error;
    }
    statuses: MhStatus[];
    error: string;
}

@Injectable({ providedIn: 'root' })
export class RuntimeService {

    private serverReady: boolean = false;
    private mhStatusesData: MhStatuses = new MhStatuses([
        {stage: Stage.metaheuristic, status: Status.none},
        {stage: Stage.tomcat, status: Status.none},
        {stage: Stage.datasource, status: Status.none},
        {stage: Stage.liquibase, status: Status.none}
    ], null);
/*
    private mhStatusesData: MhStatuses = new MhStatuses([
        {stage: Stage.metaheuristic, status: Status.done},
        {stage: Stage.tomcat, status: Status.started},
        {stage: Stage.datasource, status: Status.error},
        {stage: Stage.liquibase, status: Status.none}
    ], "Error, Error, Error, Error, Error");
*/

    private _mhStatuses = new BehaviorSubject<MhStatuses>(this.mhStatusesData);

    get mhStatuses() {
        return this._mhStatuses.asObservable()
    }

    updateMhStatuses() {
        this._mhStatuses.next(this.mhStatusesData);
    }

    constructor(
        private authenticationService: AuthenticationService,
    ) {
    }

    setServerReady(url: string) {
        let startsWith = url.startsWith(environment.baseUrl);
        console.log("Set server is ready. ulr: ",  url, ", startWith baseUrl: ", startsWith);
        if (startsWith) {
            if (environment.standalone) {
                this.authenticationService.login(environment.userAuth.username, environment.userAuth.password);
            }
            this.serverReady = true;
        }
    }

    isServerReady(): boolean {
        return this.serverReady;
    }


    setMhStatuses(jsonl: string) {
        // console.log("mhStatuses jsonl", jsonl);
        let lines = jsonl.split(/\n/);
        for (const json of lines) {
            if (!json) {
                continue;
            }
            // {"stage":"tomcat","status":"start","error":null}
            // {"stage":"tomcat","status":"done","error":null}
            // {"stage":"datasource","status":"start","error":null}
            // {"stage":"datasource","status":"done","error":null}
            // {"stage":"liquibase","status":"start","error":null}
            // {"stage":"liquibase","status":"done","error":null}

            try {
                // console.log("mhStatuses json", json);
                let parsed: MhStatusRaw = JSON.parse(json);
                let item = this.mhStatusesData.statuses.find(i => i.stage === parsed.stage);
                if (parsed.status==='start') {
                    item.status = Status.started;
                }
                if (parsed.status==='done') {
                    item.status = Status.done;
                }
                if (parsed.error) {
                    this.mhStatusesData.error = parsed.error;
                    item.status = Status.error;
                }
                if (parsed.status !==Stage.metaheuristic) {
                    let mhItem = this.mhStatusesData.statuses.find(i => i.stage === Stage.metaheuristic);
                    mhItem.status = Status.done;
                }
            } catch (e) {
                console.log(e);
            }
        }


        this.updateMhStatuses();
        console.log("mhStatusesData", this.mhStatusesData);
    }
}