import { AuthenticationService } from '../services/authentication';

export class UIStateComponent {

    constructor(readonly authenticationService: AuthenticationService) { }

    isRole: {
        Admin: boolean;
        Manager: boolean;
        Operator: boolean;
        Data: boolean;
        MasterAdmin: boolean;
        MasterOperator: boolean;
        MasterSupport: boolean;
        MasterAssetManager: boolean;
    } = {
            Admin: this.authenticationService.isRoleAdmin(),
            Manager: this.authenticationService.isRoleManager(),
            Operator: this.authenticationService.isRoleOperator(),
            Data: this.authenticationService.isRoleData(),
            MasterAdmin: this.authenticationService.isRoleMasterAdmin(),
            MasterOperator: this.authenticationService.isRoleMasterOperator(),
            MasterSupport: this.authenticationService.isRoleMasterSupport(),
            MasterAssetManager: this.authenticationService.isRoleMasterAssetManager()
        };

    isLoading: boolean = false;

    setIsLoadingStart(): void {
        this.isLoading = true;
    }

    setIsLoadingEnd(): void {
        this.isLoading = false;
    }

}