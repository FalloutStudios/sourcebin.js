import { Nothing } from 'fallout-utility';
import { APIBinFileData, APIGetBinResponse } from '../types/apiTypes';
import { BinFile } from './BinFile';
import { Client } from './Client';
import { LongSourcebinURL, ShortSourcebinURL } from '..';
import { AxiosRequestConfig } from 'axios';

export interface BinOptions extends Nothing<Omit<APIGetBinResponse, 'files'> & { files: (Omit<APIBinFileData, 'content'> & { content?: string; })[] }> {
    client?: Client;
}

export class Bin implements Omit<APIGetBinResponse, 'created'> {
    public hits!: number;
    public _id!: string;
    public key!: string;
    public title?: string;
    public created!: Date;
    public description?: string;
    public files: BinFile[] = [];
    public client?: Client;

    get url(): LongSourcebinURL<true> {
        return `https://sourceb.in/${this.key}`;
    }

    get shortURL(): ShortSourcebinURL<true> {
        return `https://srcb.in/${this.key}`;
    }

    constructor(options: BinOptions, contents?: { content: string; index: number; }[]) {
        this._updateData(options, contents);
    }

    public async fetch(requestOptions?: AxiosRequestConfig): Promise<this> {
        const data = await Client.getBin(this.key, requestOptions);
        this._updateData(data);

        return this;
    }

    public async fetchFileContents(): Promise<string[]> {
        return Promise.all(this.files.map(async f => f.fetchContent()));
    }

    public async delete(): Promise<void> {
        const data = await this.client?.deleteBin(this.key);
        if (!data?.success) throw new Error('Unable to delete bin.', { cause: data });

        this.client?.cache.delete(this.key);
    }

    public toJSON(): Omit<APIGetBinResponse, 'files'> & { files: APIBinFileData[] } {
        return {
            hits: this.hits,
            _id: this._id,
            key: this.key,
            created: this.created.toISOString(),
            title: this.title,
            description: this.description,
            files: this.files.map(f => f.toJSON())
        };
    }

    public _updateData(data: BinOptions, contents?: { content: string; index: number; }[]): void {
        this.hits = data.hits ?? this.hits;
        this._id = data._id ?? this._id;
        this.key = data.key ?? this.key;
        this.created = data.created ? new Date(data.created) : this.created;
        this.title = data.title ?? this.title;
        this.description = data.description ?? this.description;
        this.files = data.files?.map((f, i) => {
            const content = contents?.find(c => c.index === i)?.content;
            if (content) f.content = content;

            return new BinFile(this, i, f);
        }) ?? this.files;

        this.client = data.client;
    }
}