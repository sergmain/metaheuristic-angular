// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.xxx.ts`.
// The list of file replacements can be found in `angular.json`.

export let environment: {
    baseUrl: string;
    production: boolean;
    userLifeTime?: number;
};
environment = {
    production: false,
    baseUrl: 'http://localhost:8080/rest/v1/',
    userLifeTime: 24 * 60 * 60 * 1000 // 24 hours
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.