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

export interface APIFetchUserResponse {
    username: string;
    about: {
        avatarURL?: string;
        bio?: string;
        website?: string;
        location?: string;
    };
    oauth: {
        discord?: string;
        github?: string;
    };
    plan: string;
    createdAt: string;
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