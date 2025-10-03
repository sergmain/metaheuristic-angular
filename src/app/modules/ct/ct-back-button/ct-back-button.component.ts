import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

export interface MenuItem {
    label: string;
    url: string;
}


@Component({
    selector: 'ct-back-button',
    templateUrl: './ct-back-button.component.html',
    styleUrls: ['./ct-back-button.component.sass'],
    standalone : true,
    imports: [MatIconButton, MatTooltip, MatIcon]
})
export class CtBackButtonComponent implements OnInit, OnDestroy {
      private router = inject(Router);
      private activatedRoute = inject(ActivatedRoute);
    subs: Subscription[] = [];

    config = signal<string[] | undefined>(undefined);

    ngOnInit(): void {
        this.subs.push(this.router.events.subscribe(() => {
            this.setConfig();
        }));
        this.subs.push(this.activatedRoute.firstChild.data.subscribe(() => {
            this.setConfig();
        }));
    }
    setConfig(): void {
        this.config.set(this.activatedRoute?.snapshot?.firstChild?.data?.backConfig);
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    back(): void {
        this.router.navigate(this.serialize(this.config()));
    }

    serialize(config: string[]): string[] {
        let list: string[] = [].concat(this.router.url.split('/')).concat(config);
        config.forEach(() => list = fn(list));

        function fn(l: string[]): string[] {
            const i: number = l.indexOf('../') + 1;
            if (i) {
                l[l.indexOf('../') - 1] = null;
                l[l.indexOf('../')] = null;
            }
            return l.filter(v => v ? v : false);
        }
        return list;
    }
}
