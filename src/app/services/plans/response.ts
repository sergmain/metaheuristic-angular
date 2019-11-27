import { DefaultResponse, Pageable } from '@src/app/models';
import { IPlan } from './IPlan';
import { IWorkbook } from './IWorkbook';
import { Sort } from '@src/app/models/Sort';


export namespace response {
    export namespace plans {
        export interface Get extends DefaultResponse {
            items: {
                content ? : (IPlan)[] | null;
                pageable: Pageable;
                size: number;
                number: number;
                sort: Sort;
                numberOfElements: number;
                first: boolean;
                last: boolean;
                empty: boolean;
            }
        }
    }
    export namespace plan {
        export interface Get extends DefaultResponse {
            plan: IPlan;
        }

        export interface Update extends DefaultResponse {}

        export interface Validate extends DefaultResponse {}

        export interface Delete extends DefaultResponse {}

        export interface Archive extends DefaultResponse {}

        export interface Add extends DefaultResponse {
            plan: IPlan;
        }
    }
    export namespace workbooks {
        export interface Get extends DefaultResponse {
            instances: {
                content ? : (IWorkbook)[] | null;
                pageable: Pageable;
                size: number;
                number: number;
                sort: Sort;
                numberOfElements: number;
                first: boolean;
                last: boolean;
                empty: boolean;
            };
            currentPlanId: number;
            plans: (IPlan)[];
        }
    }
    export namespace workbook {
        export interface Get extends DefaultResponse {}
    }
}