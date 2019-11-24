import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IAppState } from '../../app.reducers';
import { Settings, SettingsLanguage, SettingsTheme } from './Settings';

export const setOfLanguages: Set < SettingsLanguage > = new Set([
    SettingsLanguage.EN,
    SettingsLanguage.RU,
]);

@Injectable({ providedIn: 'root' })
export class SettingsService {
    localStorageName: string = 'settingsService';

    storageDefaultData: Settings = {
        theme: SettingsTheme.Dark,
        sidenav: true,
        sidenavButton: true,
        language: SettingsLanguage.EN
    };

    constructor(
        private store: Store < IAppState >
    ) {
        this.store.subscribe((state: IAppState) => {
            this.updateTheme(state.settings.theme);
        });
    }

    update(newStorageData: any) {
        return new Observable(sub => {
            this.saveToLocalStore(newStorageData);
            sub.next(this.getFromLocalStore());
            sub.complete();
        });
    }

    getAll() {
        return new Observable(sub => {
            sub.next(this.getFromLocalStore());
            sub.complete();
        });
    }

    private updateTheme(theme: SettingsTheme) {
        const body: HTMLElement = document.querySelector('body');
        body.classList.remove('dark-theme');
        body.classList.remove('light-theme');
        switch (theme) {
            case SettingsTheme.Dark:
                body.classList.add('dark-theme');
                break;
            case SettingsTheme.Light:
                body.classList.add('light-theme');
                break;
            default:
                break;
        }
    }

    private saveToLocalStore(newStorageData: Settings): void {
        localStorage.setItem(this.localStorageName, JSON.stringify(Object.assign({}, this.storageDefaultData, newStorageData)));
    }

    private getFromLocalStore(): Settings {
        return Object.assign({}, JSON.parse(localStorage.getItem(this.localStorageName)));
    }
}