import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IAppState } from '../../app.reducers';
import { defaultSettings, Settings, SettingsTheme } from './Settings';
import * as action from './settings.actions';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    localStorageName: string = 'settingsService';

    storageDefaultData: Settings = defaultSettings;

    constructor(
        private store: Store < IAppState >
    ) {
        this.saveToLocalStore(this.storageDefaultData)
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