import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { SimpleCompany } from './SimpleCompany';

export interface SimpleCompanyResult extends DefaultResponse {
    company: SimpleCompany;

}