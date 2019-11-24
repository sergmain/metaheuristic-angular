export interface IEnvironment {
    baseUrl: string;
    production: boolean;
    userLifeTime ? : number;
    hashLocationStrategy: boolean;
    isSslRequired: boolean;
}