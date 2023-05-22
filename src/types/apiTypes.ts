import { LanguageType } from './languages';

export interface APICreateBinResponse {
    key: string;
    languages: LanguageType[];
}

export interface APIGetBinResponse extends Omit<APIBinData, 'files'> {
    hits: number;
    _id: string;
    key: string;
    files: Omit<APIBinFileData, 'content'>[];
    created: string;
}

export interface APIDeleteBinResponse {
    success: boolean;
}

export interface APIBinData {
    title?: string;
    description?: string;
    files: APIBinFileData[];
}

export interface APIBinFileData {
    name?: string;
    content: string;
    languageId?: LanguageType;
}