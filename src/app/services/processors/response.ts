import { DefaultListOfItems } from '@app/models/DefaultListOfItems';
import { DefaultResponse } from '@app/models/DefaultResponse';
import { Processor } from './Processor';


export namespace response {
    export namespace processors {
        export interface Get extends DefaultResponse {
            items: Processors;
        }
    }

    export namespace processor {
        export interface Get extends DefaultResponse {
            processor: Processor;
        }
    }
}

export interface Processors extends DefaultListOfItems {
    content: ListItemProcessor[];
}

export interface ListItemProcessor {
    active: boolean;
    blacklisted: boolean;
    host: string;
    ip: string;
    lastSeen: number;
    processor: Processor;
}

