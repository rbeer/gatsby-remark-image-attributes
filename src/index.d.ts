import { HTML, Image } from 'mdast';

type GatsbyLogger = any;

interface Options {
  styleAttributes?: string[];
  dataAttributes?: boolean;
}

export type Attributes = {
  [key: string]: string;
};

export declare function isImageHtml(node: any): boolean;
export declare function findWidth(value: string): string;

export type AttributeImageNode = Image | HTML;

export interface AttributeImage {
  node: AttributeImageNode
  attributes: ImageAttributes
  get html(): string
  get mdastNode(): AttributeImageNode
}

