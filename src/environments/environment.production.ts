import { IEnvironment } from './IEnvironment';

export const environment: IEnvironment = {
    production: true,
    baseUrl: 'http://localhost:8080/rest/v1/',
    hashLocationStrategy: true,
    userLifeTime: 30 * 60 * 1000, // 30 minutes
    isSslRequired: true,
    batchInterval: 15 * 1000, // in milliseconds
    language: 'EN', // other supported languages: 'RU'
    brandingMsg: '<p><b>Проба ИИИ</b></p>' +
        '<code>brandingMsg</code>' +
        '<p>Lorem ipsum <b>dolor</b>, sit amet consectetur adipisicing elit. Aperiam, ' +
        'libero molestiae! Neque fugiat necessitatibus pariatur aliquid vel rerum ad sequi, ' +
        'sed beatae hic consequatur similique eveniet reiciendis sapiente soluta explicabo.</p>',
    brandingMsgIndex: '<p><b>Проба ИИИ</b></p>' +
        '<code>brandingMsgIndex</code>' +
        '<p>Lorem ipsum <b>dolor</b>, sit amet consectetur adipisicing elit. Aperiam, ' +
        'libero molestiae! Neque fugiat necessitatibus pariatur aliquid vel rerum ad sequi, ' +
        'sed beatae hic consequatur similique eveniet reiciendis sapiente soluta explicabo.</p>',
};