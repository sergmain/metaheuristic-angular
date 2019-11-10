export let environment: {
    baseUrl: string;
    production: boolean;
    userLifeTime?: number;
};
environment = {
    production: true,
    baseUrl: 'http://localhost:8080/rest/v1/',
    userLifeTime: 30 * 60 * 1000 // 30 minutes
};