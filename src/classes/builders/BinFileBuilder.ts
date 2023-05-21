import { LanguageType } from '../..';
import { APIBinFileData } from '../../types/apiTypes';

export class BinFileBuilder {
    private data: APIBinFileData = { content: '' };

    public setName(name?: string|null): this {
        this.data.name = name || undefined;
        return this;
    }

    public setContent(content: string): this {
        this.data.content = content;
        return this;
    }

    public setLanguage(language?: LanguageType|(keyof typeof LanguageType)|null): this {
        this.data.languageId = typeof language === 'number'
            ? language
            : typeof language === 'string'
                ? LanguageType[language]
                : undefined;

        return this;
    }

    public toJSON(): APIBinFileData {
        return this.data;
    }
}