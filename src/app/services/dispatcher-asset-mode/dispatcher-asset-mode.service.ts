import { Injectable } from '@angular/core';
import { DispatcherAssetMode } from '@app/enums/DispatcherAssetMode';

@Injectable({
    providedIn: 'root'
})
export class DispatcherAssetModeService {

    constructor() { }

    isLocal(value: DispatcherAssetMode): boolean {
        if (value === DispatcherAssetMode.local) { return true; }
        return false;
    }
    isReplicated(value: DispatcherAssetMode): boolean {
        if (value === DispatcherAssetMode.replicated) { return true; }
        return false;
    }
    isSource(value: DispatcherAssetMode): boolean {
        if (value === DispatcherAssetMode.source) { return true; }
        return false;
    }
}
