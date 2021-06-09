import { HTML, Image } from 'mdast';

type GatsbyLogger = any;

interface Options {
  styleAttributes?: string[];
  dataAttributes?: boolean;
}

export type Attributes = {
  [key: string]: string;
};

export type AttributeImageNode = Image | HTML;
