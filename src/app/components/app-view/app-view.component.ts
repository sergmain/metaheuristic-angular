import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSelect, MatSelectChange} from '@angular/material/select';
import {MatDialog} from '@angular/material/dialog';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { ActivationEnd, Router, RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';
import {AuthenticationService} from '@app/services/authentication/authentication.service';
import {UIStateComponent} from '@app/models/UIStateComponent';
import {setOfLanguages, SettingsLanguage, SettingsTheme} from '@app/services/settings/Settings';
import {SettingsService, SettingsServiceEventChange} from '@app/services/settings/settings.service';
import {environment} from '@src/environments/environment';
import {RuntimeService} from '@services/runtime/runtime.service';
import {MhUtils} from '@services/mh-utils/mh-utils.service';
import { NgIf, NgTemplateOutlet, NgFor } from '@angular/common';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { CtContentComponent } from '../../modules/ct/ct-content/ct-content.component';
import { CtSectionComponent } from '../../modules/ct/ct-section/ct-section.component';
import { CtSectionBodyComponent } from '../../modules/ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../modules/ct/ct-section-body-row/ct-section-body-row.component';
import { LoginComponent } from '../login/login.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { BatchChangeNotificationComponent } from '../batch-change-notification/batch-change-notification.component';
import { MatOption } from '@angular/material/autocomplete';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

// Declare function from index.html for Electron IPC
declare function initQuitProcess(): any;

@Component({
    selector: 'app-view',
    templateUrl: './app-view.component.html',
    styleUrls: ['./app-view.component.scss'],
    imports: [NgIf, MatToolbar, MatToolbarRow, NgTemplateOutlet, RouterOutlet, CtContentComponent, CtSectionComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, LoginComponent, MatButton, MatIcon, RouterLinkActive, RouterLink, BatchChangeNotificationComponent, MatSelect, NgFor, MatOption, MatIconButton, MatTooltip, TranslateModule, ThemeToggleComponent]
})

export class AppViewComponent extends UIStateComponent implements OnInit, OnDestroy {
    htmlContent: SafeHtml;
    sidenavButtonDisable: boolean = false;
    sidenav: boolean = false;
    theme: SettingsTheme;
    lang: {
        list?: Set<SettingsLanguage>;
        current?: SettingsLanguage;
    } = {};
    brandingTitle: string = environment.brandingTitle;

    @ViewChild('matSelectLanguage') matSelectLanguage: MatSelect;

    constructor(
        readonly authenticationService: AuthenticationService,
        private domSanitizer: DomSanitizer,
        private settingsService: SettingsService,
        private runtimeService: RuntimeService,
        private router: Router,
        private dialog: MatDialog
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.htmlContent = this.domSanitizer.bypassSecurityTrustHtml(
            environment.brandingMsgIndex
        );
        this.lang.list = setOfLanguages;
        this.subscribeSubscription(this.router.events.subscribe((event) => {
            if (event instanceof ActivationEnd) {
                this.sidenavButtonDisable = !event.snapshot?.data?.sidenavExist;
            }
        }));
        this.subscribeSubscription(
            this.settingsService.events.subscribe(event => {
                if (event instanceof SettingsServiceEventChange) {
                    this.theme = event.settings.theme;
                    this.lang.current = event.settings.language;
                    this.sidenav = event.settings.sidenav;
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.unsubscribeSubscriptions();
    }

    isAuth(): boolean {
        return this.authenticationService.isAuth();
    }

    toggleSideNav(): void {
        this.settingsService.toggleSidenav();
    }

    toggleTheme(checked: boolean): void {
        this.settingsService.toggleTheme();
    }

    toggleLanguage(event: MatSelectChange): void {
        this.settingsService.toggleLanguage(event.value);
    }

    logout(): void {
        this.authenticationService.logout().subscribe();
    }

    shutdown() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: {
                title: 'Close Metaheuristic',
                message: 'Do you want to quit Metaheuristic? All unsaved changes will be lost.',
                confirmText: 'Quit',
                cancelText: 'Stay',
                confirmColor: 'warn'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.performShutdown();
            }
        });
    }

    private performShutdown(): void {
        // Check if we're in Electron environment
        if (this.isElectron()) {
            try {
                initQuitProcess();
                return;
            } catch (error) {
                console.warn('Failed to quit via Electron IPC:', error);
            }
        }

        // For all other environments, simply use window.close()
        // The browser will handle whether it can close or not
        window.close();
    }

    private isElectron(): boolean {
        return !!(window && (window as any).require);
    }

    serverReady() {
        return this.runtimeService.isServerReady();
    }

    protected readonly MhUtils = MhUtils;
}