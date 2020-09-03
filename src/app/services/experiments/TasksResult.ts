import { Task } from './Task';
import { PageableDefault } from '@src/app/models/PageableDefault';
import { DefaultResponse } from '@src/app/models/DefaultResponse';

interface ItemEntity extends PageableDefault {
    content: TaskEntity[];
}

interface TaskEntity {
    task: Task;
    type: number;
}

export interface TasksResult extends DefaultResponse {
    items: ItemEntity;
}