import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Settings, SettingsLanguage, SettingsSidenav, SettingsSidenavState, SettingsTheme } from './Settings';
import { Router, RoutesRecognized, RouterEvent, ActivatedRoute } from '@angular/router';

export const setOfLanguages: Set < SettingsLanguage > = new Set([
    SettingsLanguage.EN,
    SettingsLanguage.RU,
]);

@Injectable({ providedIn: 'root' })
export class SettingsService {
    private settings: Settings;
    private defaultSettings: Settings = {
        theme: SettingsTheme.Light,
        sidenavState: SettingsSidenavState.Open,
        sidenav: SettingsSidenav.Enable,
        language: SettingsLanguage.EN
    };

    settingsObserver: BehaviorSubject < any > ;

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.settings = this.getSettingsFromLocalStore();
        this.settingsObserver = new BehaviorSubject < any > (this.settings);
        this.router.events.subscribe((event: RouterEvent) => {
            if (event instanceof RoutesRecognized) {
                if (this.getRouteData(event).sidenav) {
                    this.settings.sidenav = SettingsSidenav.Enable;
                } else {
                    this.settings.sidenav = SettingsSidenav.Disable;
                }
                this.saveSettingsToLocalStore()
            }
        });
        this.updateTheme();
    }

    private saveSettingsToLocalStore(): void {
        localStorage.setItem('settingsService', JSON.stringify(this.settings));
        this.settingsObserver.next(this.getSettingsFromLocalStore());
    }

    private getSettingsFromLocalStore(): Settings {
        return Object.assign({}, this.defaultSettings, JSON.parse(localStorage.getItem('settingsService')));
    }

    private updateTheme() {
        const body: HTMLElement = document.querySelector('body');
        body.classList.remove('dark-theme');
        body.classList.remove('light-theme');
        switch (this.settings.theme) {
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

    private getRouteData(event: any) {
        let data: any = {};
        return getData(event.state.root.firstChild);

        function getData(firstChild: any) {
            data = Object.assign(data, firstChild.data);
            if (firstChild.firstChild) {
                return getData(firstChild.firstChild);
            }
            return data;
        }
    }

    toggleLanguage(value: string) {
        value = value.trim().toUpperCase();
        switch (value) {
            case SettingsLanguage.RU:
                this.settings.language = SettingsLanguage.RU;
                break;
            case SettingsLanguage.EN:
                this.settings.language = SettingsLanguage.EN;
                break;
            default:
                this.settings.language = SettingsLanguage.EN;
                break;
        }
        this.saveSettingsToLocalStore();
    }

    toggleTheme(check: boolean) {
        switch (check) {
            case true:
                this.settings.theme = SettingsTheme.Dark;
                break;
            case false:
                this.settings.theme = SettingsTheme.Light;
                break;
            default:
                this.settings.theme = SettingsTheme.Light;
                break;
        }
        this.updateTheme();
        this.saveSettingsToLocalStore();
    }

    toggleSidenav() {
        switch (this.settings.sidenavState) {
            case SettingsSidenavState.Hide:
                this.settings.sidenavState = SettingsSidenavState.Open;
                break;
            case SettingsSidenavState.Open:
                this.settings.sidenavState = SettingsSidenavState.Hide;
                break;
            default:
                this.settings.sidenavState = SettingsSidenavState.Open;
                break;
        }
        this.saveSettingsToLocalStore();
    }
}