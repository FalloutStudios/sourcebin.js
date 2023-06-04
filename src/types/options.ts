export type SourcebinURL = `${'http://'|'https://'}${'sourceb'|'srcb'}.in/${string}`;

export interface GetBinOptions {
    key: string;
    /**
     * @default true
     */
    fetchContent?: boolean;
}