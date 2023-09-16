import {Injectable} from '@angular/core';
import {environment} from '@src/environments/environment';
import {AuthenticationService} from '@services/authentication';

class MhStatus {
    stage: string;
    status: string;
    error: string;
}

@Injectable({ providedIn: 'root' })
export class RuntimeService {

    private serverReady: boolean = false;
    private mhStatuses: MhStatus[] = [];

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
        this.mhStatuses = [];
        let lines = jsonl.split(/\n/);
        for (const json of lines) {
            if (!json) {
                continue;
            }
            try {
                // console.log("mhStatuses json", json);
                this.mhStatuses.push(JSON.parse(json));
            } catch (e) {
                console.log(e);
            }
        }
        //console.log("mhStatuses", this.mhStatuses);
    }
}