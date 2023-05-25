import { LanguageType } from '../types/languages';
import { APIBinFileData } from '../types/apiTypes';
import { Bin } from './Bin';
import { Client } from '..';

export class BinFile implements APIBinFileData {
    private _content: string|null = null;

    readonly name?: string;
    readonly languageId?: LanguageType;

    get content() {
        return this._content || '';
    }

    get language() {
        return typeof this.languageId === 'number' ? LanguageType[this.languageId] as (keyof typeof LanguageType) : undefined;
    }

    constructor(readonly bin: Bin, readonly index: number, file: Partial<APIBinFileData>) {
        this.name = file.name;
        this._content = file.content || null;
        this.languageId = file.languageId;
    }

    public async fetchContent(): Promise<string> {
        const content = await Client.getBinContent(this.bin.key, this.index);
        this._content = content;
        return content;
    }

    public toJSON(): APIBinFileData {
        return {
            name: this.name,
            content: this.content,
            languageId: this.languageId
        };
    }
}