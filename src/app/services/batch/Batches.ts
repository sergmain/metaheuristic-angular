import { Pageable } from '@app/models/Pageable';
import { PageableDefault } from '@app/models/PageableDefault';
import { Batch } from './Batch';
export interface Batches extends PageableDefault {
    content: Batch[];
}