
export interface UserAuth {
    username: string;
    password: string;
}

export interface IEnvironment {
    baseUrl: string;
    production: boolean;
    userLifeTime ? : number;
    hashLocationStrategy: boolean;
    isSslRequired: boolean;
    batchInterval: number;
    language: string;
    brandingMsg: string;
    brandingMsgIndex: string;
    brandingTitle: string;
    forTableRow: string;
    standalone: boolean;
    userAuth: UserAuth;
}