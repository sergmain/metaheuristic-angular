import { Route } from '@angular/compiler/src/core';
import { RoleRouteGuard } from '@src/app/guards/role-route.guard';
import { Role } from '@src/app/services/authentication';
import { AboutRoutes } from './modules/about/about.module';
import { AccountsRoutes } from './modules/accounts/accounts.module';
import { AiRoutes } from './modules/ai/ai.module';
import { BatchRoutes } from './modules/batch/batch.module';
import { CompanyRoutes } from './modules/company/company.module';
import { DispatcherRoutes } from './modules/dispatcher/dispatcher.module';
import { ExperimentsRoutes } from './modules/experiments/experiments.module';
import { FunctionsRoutes } from './modules/functions/functions.module';
import { GlobalVariablesRoutes } from './modules/global-variables/global-variables.module';
import { ProcessorsRoutes } from './modules/processors/processors.module';
import { SourceCodesRoutes } from './modules/source-codes/source-codes.module';
import { Routes } from '@angular/router';



const LISTS: { route: Route[], name: string }[] = [
    { route: AboutRoutes, name: 'About' },
    { route: AccountsRoutes, name: 'Accounts' },
    { route: AiRoutes, name: 'Ai' },
    { route: BatchRoutes, name: 'Batch' },
    { route: CompanyRoutes, name: 'Company' },
    { route: DispatcherRoutes, name: 'Dispatcher' },
    { route: ExperimentsRoutes, name: 'Experiments' },
    { route: FunctionsRoutes, name: 'Functions' },
    { route: GlobalVariablesRoutes, name: 'GlobalVariables' },
    { route: ProcessorsRoutes, name: 'Processors' },
    { route: SourceCodesRoutes, name: 'SourceCodes' },
];

const wrapPath = (path: string) => `.../${path}`;

describe('Routers: (NOT TEST, ONLY INFO)', () => {

    LISTS.forEach(LIST => {
        const routeList: RouteItem[] = getRouteList(LIST.route);

        describe('◼️ ' + LIST.name, () => {
            routeList.forEach(route => {
                const isExistTogether: boolean = (route.isRoleRouteGuard === true) && (!!route.roles?.length === true);
                const existTogether: string = `\xa0\xa0\xa0🟩 canActivate and requiredRoles exist together`;
                const NOTExistTogether: string = `\xa0\xa0\xa0🟦 NOT exist together`;
                const roles: string = `\xa0\xa0\xa0🧑×${route.roles.length} ${convertRolesToString(route.roles)}`;

                if (isExistTogether) {
                    it(route.path + roles + existTogether, () => {
                        expect(isExistTogether).toBeTruthy();
                    });
                }
                else {
                    it(route.path + NOTExistTogether, () => {
                        expect(isExistTogether).toBeFalsy();
                    });
                }

                // describe(route.path, () => {

                //     if (isExistTogether) {
                //         it('🟩 canActivate and requiredRoles exist together', () => {
                //             expect(isExistTogether).toBeTruthy();
                //         });
                //     } else {
                //         it('🟦 NOT exist together', () => {
                //             expect(isExistTogether).toBeFalsy();
                //         });
                //     }

                //     if (isExistTogether) {
                //         it(` 🧑×${route.roles.length} ${convertRolesToString(route.roles)}`, () => {
                //             expect(isExistTogether).toBeTruthy();
                //         });
                //     }


                //     if (isExistTogether) {
                //         it('Guard is ' + RoleRouteGuard.name + ': ', () => {
                //             const checks: boolean[] = [];
                //             route.canActivate.forEach(guard => {
                //                 checks.push((guard as any).name === RoleRouteGuard.name);
                //             });
                //             expect(checks.includes(true)).toBeTruthy();
                //         });

                //         // it(route.roles.length + ' toBeGreaterThanOrEqual', () => {
                //         //     expect(route.roles.length).toBeGreaterThanOrEqual(1);
                //         // });
                //     }
                // });
            });
        });

    });
});





function convertRolesToString(roles?: Role[]): string {
    return roles.map(role => {
        const s: string[] = role.replace('ROLE_', '')
            .toLowerCase()
            .split('_')
            .map(v => {
                const ss: string[] = [...v];
                ss[0] = ss[0].toUpperCase();
                return ss.join('');
            });
        return s.join('');
    }).join(', ');
}






interface RouteItem {
    path: string;
    roles: Role[];
    canActivate: RoleRouteGuard[];
    isRoleRouteGuard: boolean;
}
function getRouteList(IN_ROUTES: Routes): RouteItem[] {
    const OUT_LIST: RouteItem[] = [];
    check(IN_ROUTES, OUT_LIST);

    function check(routes: Routes, list: RouteItem[]): void {
        routes.forEach(route => {
            list.push({
                path: (route.path === '') ? '(index)' : route.path,
                canActivate: route?.canActivate || [],
                roles: route?.data?.requiredRoles || [],
                isRoleRouteGuard: !!(route?.canActivate as any[])?.find(r => (r as any).name === RoleRouteGuard.name)
            });
            if (route.children?.length) {
                check(route.children, list);
            }
        });
    }
    return OUT_LIST;
}
