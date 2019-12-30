import { Batch } from './Batch';
import { response } from './response';

export interface BatchesState {
    isLoading: boolean;
    response: response.batches.Get;
    list: Batch[];
}