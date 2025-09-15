import { DispatcherAssetMode } from '@app/enums/DispatcherAssetMode';
import { DefaultResponse } from '@app/models/DefaultResponse';
import { FunctionEntity } from './FunctionEntity';

export interface FunctionsResult extends DefaultResponse {
    functions: FunctionEntity[];
    assetMode: DispatcherAssetMode;
}