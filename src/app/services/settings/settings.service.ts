import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IAppState } from '../../app.reducers';
import { defaultSettings, Settings, SettingsTheme } from './Settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    localStorageName: string = 'settingsService';

    storageDefaultData: Settings = defaultSettings;

    constructor(
        private store: Store < IAppState >
    ) {
        this.store.subscribe((state: IAppState) => {
            if (state.user && state.user.username) {
                this.localStorageName = state.user.username + ':settingsService';
            }
            this.updateTheme(state);
        });
    }

    update(newStorageData: any) {
        return new Observable(subscriber => {
            this.saveToLocalStore(newStorageData);
            subscriber.next(this.getFromLocalStore());
            subscriber.complete();
        });
    }

    private updateTheme(state: IAppState) {
        const body: HTMLElement = document.querySelector('body');
        let theme = null;

        if (state.settings) {
            theme = state.settings.theme;
        }

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
                body.classList.add('light-theme');
                break;
        }
    }

    getAll() {
        return new Observable(subscriber => {
            subscriber.next(this.getFromLocalStore());
            subscriber.complete();
        });
    }

    private saveToLocalStore(newStorageData: Settings): void {
        localStorage.setItem(this.localStorageName, JSON.stringify(Object.assign({}, this.storageDefaultData, newStorageData)));
    }

    private getFromLocalStore(): Settings {
        return Object.assign({}, JSON.parse(localStorage.getItem(this.localStorageName)));
    }
}