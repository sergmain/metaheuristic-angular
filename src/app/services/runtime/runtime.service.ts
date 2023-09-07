import {Injectable} from '@angular/core';
import {environment} from '@src/environments/environment';
import {AuthenticationService} from '@services/authentication';

@Injectable({ providedIn: 'root' })
export class RuntimeService {

    private serverReady: boolean = false;

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
}