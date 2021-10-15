import { DefaultResponse } from '@app/models/DefaultResponse';
import { DispatcherAssetMode } from '@app/enums/DispatcherAssetMode';
import { Pageable } from '@app/models/Pageable';
import { Sort } from '@app/models/Sort';
import { SimpleCompany } from '@app/services/company/SimpleCompany';
import { PageableDefault } from '@app/models/PageableDefault';

export interface SimpleCompaniesResult extends DefaultResponse {
    companies: PageableDefault & {
        content: SimpleCompany[];
    };
    assetMode: DispatcherAssetMode;
}
