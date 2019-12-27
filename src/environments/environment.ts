import { IEnvironment } from './IEnvironment';

export const environment: IEnvironment = {
    production: false,
    baseUrl: 'http://localhost:8080/rest/v1/',
    hashLocationStrategy: true,
    userLifeTime: 30 * 60 * 1000, // 30 minutes
    isSslRequired: false,
    batchInterval: 5 * 1000, // pause between requests in milliseconds, 0 means a disable of any requests
    language: 'RU',
    brandingTitle: 'Branding Title',
    brandingMsg: '<p>Lorem ipsum <b>dolor</b>, sit amet consectetur adipisicing elit. Aperiam, ' +
        'libero molestiae! Neque fugiat necessitatibus pariatur aliquid vel rerum ad sequi, ' +
        'sed beatae hic consequatur similique eveniet reiciendis sapiente soluta explicabo.</p>',
    brandingMsgIndex: '<p>Lorem ipsum <b>dolor</b>, sit amet consectetur adipisicing elit. Aperiam, ' +
        'libero molestiae! Neque fugiat necessitatibus pariatur aliquid vel rerum ad sequi, ' +
        'sed beatae hic consequatur similique eveniet reiciendis sapiente soluta explicabo.</p>',
};
