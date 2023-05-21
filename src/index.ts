import { BinBuilder } from './classes/builders/BinBuilder';
import { APIBinData } from './types/apiTypes';
import { Client } from './classes/Client';

export * from './classes/builders/BinBuilder';
export * from './classes/builders/BinFileBuilder';
export * from './classes/Bin';
export * from './classes/BinFile';
export * from './classes/Client';
export * from './types/apiTypes';
export * from './types/languages';
export * from './types/options';

export const create = (bin: APIBinData|BinBuilder) => Client.createBin(bin);
export const get = (key: string) => Client.getBin(key);
