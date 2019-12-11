import { IEnvironment } from './IEnvironment';

export const environment: IEnvironment = {
    production: false,
    baseUrl: 'http://localhost:8080/rest/v1/',
    hashLocationStrategy: true,
    userLifeTime: 30 * 60 * 1000, // 30 minutes
    isSslRequired: false,
    batchInterval: 15 * 1000, // pause between requests in milliseconds, 0 means a disable of any requests
    language: 'RU',
    lorem: '<p><b>Проба ИИИ</b></p>' +
        '<p>Lorem ipsum <b>dolor</b>, sit amet consectetur adipisicing elit. Aperiam, ' +
        'libero molestiae! Neque fugiat necessitatibus pariatur aliquid vel rerum ad sequi, ' +
        'sed beatae hic consequatur similique eveniet reiciendis sapiente soluta explicabo.</p>'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */