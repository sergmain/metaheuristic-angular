import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppState } from '../../app.reducers';
import { defaultSettings, Settings, SettingsTheme } from './Settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    localStorageName: string = 'settingsService';

    storageDefaultData: Settings = defaultSettings;

    data: BehaviorSubject<Settings> = new BehaviorSubject<Settings>(defaultSettings);

    constructor(
        private store: Store<AppState>
    ) {
        this.store.subscribe((state: AppState) => {
            if (state.user && state.user.username) {
                this.localStorageName = state.user.username + ':settingsService';
            }
            this.updateTheme(state);
        });
    }

    update(newStorageData: any): Observable<Settings> {
        return new Observable(subscriber => {
            this.saveToLocalStore(newStorageData);
            this.data.next(this.getFromLocalStore());
            subscriber.next(this.getFromLocalStore());
            subscriber.complete();
        });
    }

    private updateTheme(state: AppState): void {
        const body: HTMLElement = document.querySelector('body');
        let theme: string = null;

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

    getAll(): Observable<Settings> {
        return new Observable(subscriber => {
            this.data.next(this.getFromLocalStore());
            subscriber.next(this.getFromLocalStore());
            subscriber.complete();
        });
    }

    private saveToLocalStore(newStorageData: Settings): void {
        localStorage.setItem(
            this.localStorageName,
            JSON.stringify(Object.assign({}, this.storageDefaultData, newStorageData))
        );
    }

    private getFromLocalStore(): Settings {
        return Object.assign({}, JSON.parse(localStorage.getItem(this.localStorageName)));
    }
}