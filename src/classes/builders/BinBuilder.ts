import { RestOrArray, normalizeArray } from 'fallout-utility';
import { APIBinData, APIBinFileData } from '../../types/apiTypes';
import { BinFileBuilder } from './BinFileBuilder';

export class BinBuilder {
    private data: APIBinData = { files: [] };

    public setTitle(title: string): this {
        this.data.title = title;
        return this;
    }

    public setDescription(description: string): this {
        this.data.description = description;
        return this;
    }

    public addFile(file: ((f: BinFileBuilder) => BinFileBuilder)|BinFileBuilder): this {
        this.data.files.push(file instanceof BinFileBuilder ? file.toJSON() : file(new BinFileBuilder()).toJSON());
        return this;
    }

    public addFiles(...files: RestOrArray<APIBinFileData|BinFileBuilder>): this {
        files = normalizeArray(files);
        this.data.files.push(...files.map(f => f instanceof BinFileBuilder ? f.toJSON() : f));
        return this;
    }

    public setFiles(...files: RestOrArray<APIBinFileData|BinFileBuilder>): this {
        files = normalizeArray(files);
        this.data.files = files.map(f => f instanceof BinFileBuilder ? f.toJSON() : f);
        return this;
    }

    public toJSON(): APIBinData {
        return this.data;
    }
}