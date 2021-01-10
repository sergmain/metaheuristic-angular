import { HttpClient } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { asyncData } from '@src/testing/async-observable-helpers';
import { AuthenticationService } from './authentication.service';
import { Role } from './Role';
import { User } from './User';



const expectedUser: User = {
    authorities: [{ authority: Role.Admin }, { authority: Role.Operator }],
    publicName: 'Tom',
    username: 'Tom 23',
    token: 'Basic VG9tOjEyMw=='
};
let httpClientSpy: { get: jasmine.Spy; post: jasmine.Spy };
let routerSpy: { navigate: jasmine.Spy };
let authenticationService: AuthenticationService;
httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
routerSpy = jasmine.createSpyObj('Router', ['navigate']);
authenticationService = new AuthenticationService(httpClientSpy as any, routerSpy as any);
httpClientSpy.post.and.returnValue(asyncData(expectedUser));


describe('Authentication Service', () => {

    it('.logout() ...зачистка от прошлого теста', fakeAsync(() => {
        authenticationService.logout().subscribe();
        tick(10);
        expect(authenticationService.user).toEqual(null);
    }));

    it('.user === null', () => {
        expect(authenticationService.user).toEqual(null);
    });
    it('.isAuth() === false', () => {
        expect(authenticationService.isAuth()).toBeFalsy();
    });
    it('.login("Tom","123")', fakeAsync(() => {
        authenticationService.login('Tom', '123');
        tick(10);
        expect(authenticationService.user).toEqual(expectedUser);
    }));
    it('.user === ' + JSON.stringify(expectedUser), () => {
        expect(authenticationService.user).toEqual(expectedUser);
    });
    it('.isAuth() === true', () => {
        expect(authenticationService.isAuth()).toBeTruthy();
    });
    it('.isRoleAdmin() === true', () => {
        expect(authenticationService.isRoleAdmin()).toBeTruthy();
    });
    it('.isRoleOperator() === true', () => {
        expect(authenticationService.isRoleOperator()).toBeTruthy();
    });
    it('.isRoleMasterSupport() === false', () => {
        expect(authenticationService.isRoleMasterSupport()).toBeFalsy();
    });
    it('.logout()', fakeAsync(() => {
        authenticationService.logout().subscribe();
        tick(10);
        expect(authenticationService.user).toEqual(null);
    }));
    it('.user === null', () => {
        expect(authenticationService.user).toEqual(null);
    });
});