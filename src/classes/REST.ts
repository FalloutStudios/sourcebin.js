import { APIBinData, APICreateBinResponse, APIDeleteBinResponse, APIFetchUserResponse, APIGetBinResponse } from '../types/apiTypes';
import { JSONEncodable, isJSONEncodable } from 'fallout-utility';
import axios, { AxiosRequestConfig } from 'axios';

export class REST {
    constructor(readonly accessToken?: string) {}

    get requestOptions() {
        const options: AxiosRequestConfig = {};

        if (!this.accessToken) return options;

        options.headers = { Cookie: `access_token=${this.accessToken};` };
        options.withCredentials = true;

        return options;
    };

    public async getUser(requestOptions?: AxiosRequestConfig): Promise<APIFetchUserResponse> {
        return axios.get<APIFetchUserResponse>(`https://sourceb.in/api/user`, { ...this.requestOptions, ...requestOptions }).then(d => d.data);
    }

    public async getUserBins(requestOptions?: AxiosRequestConfig): Promise<APIGetBinResponse[]> {
        return axios.get<APIGetBinResponse[]>(`https://sourceb.in/api/user/bins`, { ...this.requestOptions, ...requestOptions }).then(d => d.data);
    }

    /**
     * Deletes bin
     * @param bin Bin data or builder
     * @param requestOptions Additional axios options
     */
    public async deleteBin(key: string, requestOptions?: AxiosRequestConfig): Promise<APIDeleteBinResponse> {
        return axios.delete<APIDeleteBinResponse>(`https://sourceb.in/api/bins/${key}`, { ...this.requestOptions, ...requestOptions }).then(d => d.data);
    }

    /**
     * Fetch bin
     * @param bin Bin data or builder
     * @param requestOptions Additional axios options
     */
    public static async createBin(bin: APIBinData|JSONEncodable<APIBinData>, requestOptions?: AxiosRequestConfig): Promise<APICreateBinResponse> {
        return axios.post<APICreateBinResponse>(`https://sourceb.in/api/bins`, isJSONEncodable(bin) ? bin.toJSON() : bin, requestOptions).then(d => d.data);
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
        return axios.get<string>(`https://cdn.sourceb.in/bins/${key}/${index}`, requestOptions).then(d => d.data);
    }
}