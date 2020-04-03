export interface GlobalVariable {
    id: number;
    version: number;
    code: string;
    poolCode: string;
    dataType: number;
    uploadTs: string;
    checksum?: null;
    valid: boolean;
    manual: boolean;
    filename: string;
    storageUrl: string;
    dataTypeAsStr: string;
}