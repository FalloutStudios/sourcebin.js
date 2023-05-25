import { Collection } from '@discordjs/collection';
import { APIBinData } from '../types/apiTypes';
import { Bin, BinOptions } from './Bin';
import { APICreateBinResponse } from '../types/apiTypes';
import { JSONEncodable } from 'fallout-utility';
import { REST } from './REST';

export interface ClientOptions {
    token?: string;
    cacheBins?: boolean;
}

export class Client extends REST {
    readonly cache: Collection<string, Bin> = new Collection();

    constructor(readonly options?: ClientOptions) {
        super(options?.token);
    }

    /**
     * Creates new bin
     * @param bin Bin data or builder
     * @param fetchContent Whether fetch content of bin after creation
     */
    public async createBin(bin: APIBinData|JSONEncodable<APIBinData>, fetchContent?: true): Promise<Bin>;
    public async createBin(bin: APIBinData|JSONEncodable<APIBinData>, fetchContent?: false): Promise<APICreateBinResponse>;
    public async createBin(bin: APIBinData|JSONEncodable<APIBinData>, fetchContent: boolean = true): Promise<Bin|APICreateBinResponse> {
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
        const data = await Client.getBin(key, this.requestOptions) as Omit<BinOptions, 'client'>;

        const bin = new Bin({ ...data, client: this });

        await bin.fetchFileContents();

        if (cache) this.addBinToCache(bin);
        return bin;
    }

    /**
     * Fetch user bins
     * @param cache Adds the feetched bins to cache if enabled
     */
    public async fetchUserBins(cache: boolean = true): Promise<Bin[]> {
        const rawBins = await this.getUserBins();
        const bins = await Promise.all(rawBins.map(async (data: Omit<BinOptions, 'client'>) => {
            const bin = new Bin({ ...data, client: this });
            await bin.fetchFileContents();
            return bin;
        }));

        if (cache) bins.forEach(b => this.addBinToCache(b));
        return bins;
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
}