import {Routes} from '@angular/router';
import {SettingsApiKeysIndexComponent} from './settings-api-keys-index/settings-api-keys-index.component';


export const SETTINGS_API_KEYS_ROUTES: Routes = [
    {
        path: '',
        component: SettingsApiKeysIndexComponent,
    }
];
