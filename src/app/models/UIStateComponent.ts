import { Subscription } from 'rxjs';
import { AuthenticationService } from '@services/authentication';

export class UIStateComponent {
    isLoading: boolean = false;
    subs: Subscription[] = [];

    constructor(readonly authenticationService: AuthenticationService) { }

    get isRole(): {
        Admin: boolean;
        Manager: boolean;
        Operator: boolean;
        Data: boolean;
        MasterAdmin: boolean;
        MasterOperator: boolean;
        MasterSupport: boolean;
        MasterAssetManager: boolean;
    } {
        return {
            Admin: this.authenticationService.isRoleAdmin(),
            Manager: this.authenticationService.isRoleManager(),
            Operator: this.authenticationService.isRoleOperator(),
            Data: this.authenticationService.isRoleData(),
            MasterAdmin: this.authenticationService.isRoleMasterAdmin(),
            MasterOperator: this.authenticationService.isRoleMasterOperator(),
            MasterSupport: this.authenticationService.isRoleMasterSupport(),
            MasterAssetManager: this.authenticationService.isRoleMasterAssetManager()
        };
    }

    subscribeSubscription(s: Subscription): void {
        this.subs.push(s);
    }

    unsubscribeSubscriptions(): void {
        // console.log(this.subs.length);
        this.subs.forEach(s => s.unsubscribe());
    }

    setIsLoadingStart(): void {
        this.isLoading = true;
    }

    setIsLoadingEnd(): void {
        this.isLoading = false;
    }

}