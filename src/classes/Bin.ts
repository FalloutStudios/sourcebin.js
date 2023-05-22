import axios from 'axios';
import { APIBinData, APIDeleteBinResponse, APIGetBinResponse } from '../types/apiTypes';
import { BinFile } from './BinFile';
import { Client } from './Client';

export interface BinOptions extends APIGetBinResponse {
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

    constructor(options: BinOptions, contents: { content: string; index: number; }[]) {
        this.hits = options.hits;
        this._id = options._id;
        this.key = options.key;
        this.created = new Date(options.created);
        this.title = options.title;
        this.description = options.description;
        this.files = options.files.map((f, i) => {
            const content = contents.find(c => c.index === i)?.content || '';
            return new BinFile(this, { ...f, content });
        });

        this.client = options.client;
    }

    public async delete(): Promise<void> {
        const data = await axios.delete<APIDeleteBinResponse>(`https://sourceb.in/api/bins/${this.key}`, this.client?.requestOptions).then(d => d.data);
        if (!data.success) throw new Error('Unable to delete bin.');

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