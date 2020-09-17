import { DispatcherAssetMode } from '@src/app/enums/DispatcherAssetMode';
import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { FunctionEntity } from './FunctionEntity';

export interface FunctionsResult extends DefaultResponse {
    functions: FunctionEntity[];
    assetMode: DispatcherAssetMode;
}