import { Injectable } from '@angular/core';
import { DispatcherAssetMode } from '@src/app/enums/DispatcherAssetMode';

@Injectable({
    providedIn: 'root'
})
export class DispatcherAssetModeService {

    constructor() { }

    isLocal(value: DispatcherAssetMode) {
        if (value === DispatcherAssetMode.local) { return true }
        return false;
    }
    isReplicated(value: DispatcherAssetMode) {
        if (value === DispatcherAssetMode.replicated) { return true }
        return false;
    }
    isSource(value: DispatcherAssetMode) {
        if (value === DispatcherAssetMode.source) { return true }
        return false;
    }
}
