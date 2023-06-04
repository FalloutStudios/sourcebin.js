import { If } from 'fallout-utility';

export type SourcebinURL<Https extends boolean = boolean> = ShortSourcebinURL<Https>|LongSourcebinURL<Https>;
export type ShortSourcebinURL<Https extends boolean = boolean> = `${If<Https, 'https://', 'http://'>}srcb.in/${string}`;
export type LongSourcebinURL<Https extends boolean = boolean> = `${If<Https, 'https://', 'http://'>}sourceb.in/${string}`;

export interface GetBinOptions {
    key: string;
    /**
     * @default true
     */
    fetchContent?: boolean;
}