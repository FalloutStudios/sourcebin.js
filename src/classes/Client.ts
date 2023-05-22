import { Collection } from '@discordjs/collection';
import { APIBinData, APIGetBinResponse } from '../types/apiTypes';
import { Bin } from './Bin';
import axios, { AxiosRequestConfig } from 'axios';
import { APICreateBinResponse } from '../types/apiTypes';
import { BinBuilder } from './builders/BinBuilder';

export interface ClientOptions {
    token?: string;
    cacheBins?: boolean;
}

export class Client {
    readonly cache: Collection<string, Bin> = new Collection();

    get accessToken() { return this.options?.token; }
    get requestOptions() {
        const options: AxiosRequestConfig = {};

        if (!this.accessToken) return options;

        options.headers = { Cookie: `access_token=${this.accessToken};` };
        options.withCredentials = true;

        return options;
    };

    constructor(readonly options?: ClientOptions) {}

    /**
     * Creates new bin
     * @param bin Bin data or builder
     * @param fetchContent Whether fetch content of bin after creation
     */
    public async createBin(bin: APIBinData|BinBuilder, fetchContent?: true): Promise<Bin>;
    public async createBin(bin: APIBinData|BinBuilder, fetchContent?: false): Promise<APICreateBinResponse>;
    public async createBin(bin: APIBinData|BinBuilder, fetchContent: boolean = true): Promise<Bin|APICreateBinResponse> {
        const response = await Client.createBin(bin, this.requestOptions);
        if (!fetchContent) return response;

        return this.fetchBin(response.key);
    }

    /**
     * Fetch bin data
     * @param key Bin key
     * @param cache Adds the fetched bin to cache if enabled
     */
    public async fetchBin(key: string, cache: boolean = true): Promise<Bin> {
        const data = await Client.getBin(key, this.requestOptions);
        const contents: { content: string; index: number; }[] = [];

        for (const index in data.files) {
            const content = await Client.getBinContent(data.key, Number(index));
            contents.push({ content, index: Number(index) });
        }

        const bin = new Bin({ ...data, client: this }, contents);

        if (cache) this.addBinToCache(bin);
        return bin;
    }

    /**
     * Retrieves the bin data from cache or fetch from api
     * @param key Bin key
     */
    public async resolveBin(key: string): Promise<Bin> {
        return this.cache.get(key) ?? this.fetchBin(key);
    }

    protected addBinToCache(bin: Bin): void {
        if (this.options?.cacheBins !== false) this.cache.set(bin.key, bin);
    }

    /**
     * Fetch bin
     * @param bin Bin data or builder
     * @param requestOptions Additional axios options
     */
    public static async createBin(bin: APIBinData|BinBuilder, requestOptions?: AxiosRequestConfig): Promise<APICreateBinResponse> {
        return axios.post<APICreateBinResponse>(`https://sourceb.in/api/bins`, bin instanceof BinBuilder ? bin.toJSON() : bin, requestOptions).then(d => d.data);
    }

    /**
     * Get raw bin data
     * @param key Bin key
     * @param requestOptions Additional axios options
     */
    public static async getBin(key: string, requestOptions?: AxiosRequestConfig): Promise<APIGetBinResponse> {
        return axios.get<APIGetBinResponse>(`https://sourceb.in/api/bins/${key}`, requestOptions).then(d => d.data);
    }

    /**
     * Get bin content
     * @param key Bin key
     * @param index Bin file index
     * @param requestOptions Additional axios options
     */
    public static async getBinContent(key: string, index: number, requestOptions?: AxiosRequestConfig): Promise<string> {
        return axios.get<string>(`https://sourceb.in/api/bins/${key}/${index}`, requestOptions).then(d => d.data);
    }
}