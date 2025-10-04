import {inject, Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class MyTranslateService {
    private translateService = inject(TranslateService);

    public translate(key: string): string {
        return this.translateService.instant(key);
    }
}