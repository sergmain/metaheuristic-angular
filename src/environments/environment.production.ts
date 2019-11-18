export let environment: {
    baseUrl: string;
    production: boolean;
    userLifeTime ? : number;
    hashLocationStrategy: boolean;
};
environment = {
    production: true,
    baseUrl: 'http://localhost:8080/rest/v1/',
    hashLocationStrategy: true,
    userLifeTime: 30 * 60 * 1000 // 30 minutes
};