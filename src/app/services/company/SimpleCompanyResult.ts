import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { CompanyAccessControl } from './CompanyAccessControl';
import { SimpleCompany } from './SimpleCompany';

export interface SimpleCompanyResult extends DefaultResponse {
    company: SimpleCompany;
    companyAccessControl: CompanyAccessControl;
}
