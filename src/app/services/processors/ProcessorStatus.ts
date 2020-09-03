import { Processor } from './Processor';
export interface ProcessorStatus {
    processor: Processor;
    active: boolean;
    functionProblem: boolean;
    blacklisted: boolean;
    blacklistReason: string;
    lastSeen: number;
    ip: string;
    host: string;
}