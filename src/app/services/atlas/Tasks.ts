import { Task } from './Task';
import { DefaultListOfItems } from '@src/app/models/DefaultListOfItems';


export interface Tasks extends DefaultListOfItems {
    content: Task[];
}