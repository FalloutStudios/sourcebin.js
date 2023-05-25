import { Nothing } from 'fallout-utility';
import { APIBinData, APIBinFileData, APIGetBinResponse } from '../types/apiTypes';
import { BinFile } from './BinFile';
import { Client } from './Client';

export interface BinOptions extends Nothing<Omit<APIGetBinResponse, 'files'> & { files: (Omit<APIBinFileData, 'content'> & { content?: string; })[] }> {
    client?: Client;
}

export class Bin implements Omit<APIGetBinResponse, 'created'> {
    readonly hits: number;
    readonly _id: string;
    readonly key: string;
    readonly title?: string;
    readonly created: Date;
    readonly description?: string;
    readonly files: BinFile[] = [];
    readonly client?: Client;

    get url() {
        return `https://sourceb.in/${this.key}`;
    }

    constructor(options: BinOptions, contents?: { content: string; index: number; }[]) {
        this.hits = options.hits;
        this._id = options._id;
        this.key = options.key;
        this.created = new Date(options.created);
        this.title = options.title;
        this.description = options.description;
        this.files = options.files.map((f, i) => {
            const content = contents?.find(c => c.index === i)?.content;
            if (content) f.content = content;

            return new BinFile(this, i, f);
        });

        this.client = options.client;
    }

    public async fetchFileContents(): Promise<string[]> {
        return Promise.all(this.files.map(async f => f.fetchContent()));
    }

    public async delete(): Promise<void> {
        const data = await this.client?.deleteBin(this.key);
        if (!data?.success) throw new Error('Unable to delete bin.');

        this.client?.cache.delete(this.key);
    }

    public toJSON(): APIBinData {
        return {
            title: this.title,
            description: this.description,
            files: this.files.map(f => f.toJSON())
        };
    }
}