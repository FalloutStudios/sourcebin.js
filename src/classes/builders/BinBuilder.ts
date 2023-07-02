import { RestOrArray, normalizeArray, JSONEncodable, isJSONEncodable } from 'fallout-utility';
import { APIBinData, APIBinFileData } from '../../types/apiTypes';
import { BinFileBuilder } from './BinFileBuilder';

export class BinBuilder {
    private data: APIBinData = { files: [] };

    public setTitle(title?: string|null): this {
        this.data.title = title || undefined;
        return this;
    }

    public setDescription(description?: string|null): this {
        this.data.description = description || undefined;
        return this;
    }

    public addFile(file: ((f: BinFileBuilder) => BinFileBuilder)|JSONEncodable<APIBinFileData>): this {
        this.data.files.push(isJSONEncodable(file) ? file.toJSON() : file(new BinFileBuilder()).toJSON());
        return this;
    }

    public addFiles(...files: RestOrArray<APIBinFileData|JSONEncodable<APIBinFileData>>): this {
        files = normalizeArray(files);
        this.data.files.push(...files.map(f => isJSONEncodable(f) ? f.toJSON() : f));
        return this;
    }

    public setFiles(...files: RestOrArray<APIBinFileData|JSONEncodable<APIBinFileData>>): this {
        files = normalizeArray(files);
        this.data.files = files.map(f => isJSONEncodable(f) ? f.toJSON() : f);
        return this;
    }

    public toJSON(): APIBinData {
        return this.data;
    }
}