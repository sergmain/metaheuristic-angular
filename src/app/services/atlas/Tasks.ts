import { Task } from './Task';
import { PageableDefault } from '@src/app/models/PageableDefault';


export interface Tasks extends PageableDefault {
    content: Task[];
}