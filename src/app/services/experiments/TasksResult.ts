import { Task } from './Task';
import { DefaultListOfItems } from '@src/app/models/DefaultListOfItems';
import { DefaultResponse } from '@src/app/models/DefaultResponse';

interface ItemEntity extends DefaultListOfItems {
    content: TaskEntity[];
}

interface TaskEntity {
    task: Task;
    type: number;
}

export interface TasksResult extends DefaultResponse {
    items: ItemEntity;
}