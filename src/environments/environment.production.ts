import { IEnvironment } from './IEnvironment';

export const environment: IEnvironment = {
    production: true,
    baseUrl: 'http://localhost:8080/rest/v1/',
    hashLocationStrategy: true,
    userLifeTime: 30 * 60 * 1000, // 30 minutes
    isSslRequired: true
};