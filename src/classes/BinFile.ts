import { LanguageType } from '../types/languages';
import { APIBinFileData } from '../types/apiTypes';
import { Bin } from './Bin';

export class BinFile implements APIBinFileData {
    readonly name?: string;
    readonly content: string;
    readonly languageId?: LanguageType;

    get language() {
        return typeof this.languageId === 'number' ? LanguageType[this.languageId] as (keyof typeof LanguageType) : undefined;
    }

    constructor(readonly bin: Bin, file: APIBinFileData) {
        this.name = file.name;
        this.content = file.content;
        this.languageId = file.languageId;
    }

    public toJSON(): APIBinFileData {
        return {
            name: this.name,
            content: this.content,
            languageId: this.languageId
        };
    }
}