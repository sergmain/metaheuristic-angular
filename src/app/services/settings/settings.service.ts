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
        // this.saveToLocalStore(this.storageDefaultData);
        this.store.subscribe((state: IAppState) => {

        });
    }

    update(newStorageData: any) {
        return new Observable(subscriber => {
            this.saveToLocalStore(newStorageData);
            subscriber.next(this.getFromLocalStore());
            subscriber.complete();
        });
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