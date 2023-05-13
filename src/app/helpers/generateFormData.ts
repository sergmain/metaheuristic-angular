import {MhUtils} from '@services/mh-utils/mh-utils.service';

export function generateFormData(params: any): FormData {
    const formData: FormData = new FormData();
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            let value = params[key];
            if (MhUtils.isNotNull(value)) {
                formData.append(key, params[key]);
            }
        }
    }
    return formData;
}
