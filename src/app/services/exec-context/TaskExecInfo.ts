import { TaskExecState } from '@app/enums/TaskExecState';

export interface TaskExecInfo {
    sourceCodeId: number;
    ExecContextId: number;
    taskId: number;
    execState: TaskExecState;
    console: string;
}