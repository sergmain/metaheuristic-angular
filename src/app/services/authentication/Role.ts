export enum Role {
    ROLE_MANAGER = 'ROLE_MANAGER',
    ROLE_OPERATOR = 'ROLE_OPERATOR',
    ROLE_DATA = 'ROLE_DATA',

    ROLE_SERVER_REST_ACCESS = 'ROLE_SERVER_REST_ACCESS',
    ROLE_ASSET_REST_ACCESS = 'ROLE_ASSET_REST_ACCESS',
    ROLE_BILLING = 'ROLE_BILLING',

    ROLE_MASTER_ADMIN = 'ROLE_MASTER_ADMIN',
    ROLE_MASTER_OPERATOR = 'ROLE_MASTER_OPERATOR',
    ROLE_MASTER_SUPPORT = 'ROLE_MASTER_SUPPORT',
    ROLE_ADMIN = 'ROLE_ADMIN'
}

// -- ROLE_ADMIN - полный доступ ко всем функциям на сайте
// -- ROLE_MANAGER
//    - доступ на чтение для функций Plan, Exec State, Function
//    - полный доступ к Batch
//    - нет доступа ко всем остальным фунцциям
// -- ROLE_OPERATOR - полный досуп ко всем функциям Batch
// -- ROLE_BILLING - полный досуп ко всем функциям Billing
// -- ROLE_DATA - полный доступ к функциям Plan, Exec State, Experiment, Atlas, Resource, Function