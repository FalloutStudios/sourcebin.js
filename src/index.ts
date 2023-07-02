import { BinBuilder } from './classes/builders/BinBuilder';
import { SourcebinURL } from './types/options';
import { APIBinData } from './types/apiTypes';
import { Client } from './classes/Client';
import { Bin } from './classes/Bin';

export * from './classes/builders/BinBuilder';
export * from './classes/builders/BinFileBuilder';
export * from './classes/Bin';
export * from './classes/BinFile';
export * from './classes/Client';
export * from './classes/REST';
export * from './types/apiTypes';
export * from './types/languages';
export * from './types/options';

/**
 * @param bin Bin data
 */
export const create = (bin: APIBinData|BinBuilder) => Client.createBin(bin);

/**
 * @param key Bin key or url
 */
export const get = async (key: string) => new Bin(await Client.getBin(key));

/**
 * @param key Bin key or url
 * @param index Bin file index
 */
export const fetchContent = (key: string, index: number = 0) => Client.getBinContent(key, index);

/**
 * @param url Could be a sourcebin url
 */
export const isSourcebin = (url: string): url is SourcebinURL => Client.isSourcebinURL(url);

/**
 * @param url Sourcebin url
 */
export const getKeyFromURL = (url: string) => Client.getKeyFromURL(url);
