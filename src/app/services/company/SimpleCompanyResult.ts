import { DefaultResponse } from '@app/models/DefaultResponse';
import { CompanyAccessControl } from '@app/services/company/CompanyAccessControl';
import { SimpleCompany } from '@app/services/company/SimpleCompany';

export interface SimpleCompanyResult extends DefaultResponse {
    company: SimpleCompany;
    companyAccessControl: CompanyAccessControl;
}
