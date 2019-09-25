import { environment } from '@src/environments/environment';
import { jsonToUrlParams as toURL } from '@app/helpers/jsonToUrlParams';

const base: string = environment.baseUrl + 'launchpad/account';

export const urls: any = {
    accounts: {
        get: (page: number): string => `${base}/accounts?page=${page}`
    },
    account: {
        get: (id: string): string => `${base}/account/${id}`,
        addCommit: (): string => `${base}/account-add-commit`,
        editCommit: (): string => `${base}/account-edit-commit`,
        passwordEditCommit: (): string => `${base}/account-password-edit-commit`,
        roleCommit: (): string => `${base}/account-role-commit`,
    }
};
