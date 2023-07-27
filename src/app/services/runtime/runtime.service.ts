import {Injectable} from '@angular/core';
import {environment} from '@src/environments/environment';

@Injectable({ providedIn: 'root' })
export class RuntimeService {

    private serverReady: boolean = false;

    constructor(
    ) {
    }

    setServerReady(url: string) {
        let startsWith = url.startsWith(environment.baseUrl);
        console.log("Set server is ready. ulr: ",  url, ", startWith baseUrl: ", startsWith);
        if (startsWith) {
            this.serverReady = true;
        }
    }

    isServerReady(): boolean {
        return this.serverReady;
    }
}