export function generateFormData(params: any): FormData {
    const formData: FormData = new FormData();
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            formData.append(key, params[key]);
        }
    }
    return formData;
};