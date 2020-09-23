import { Pageable } from '@app/models/Pageable';
import { PageableDefault } from '@src/app/models/PageableDefault';
import { Batch } from './Batch';
export interface Batches extends PageableDefault {
    content: Batch[];
}