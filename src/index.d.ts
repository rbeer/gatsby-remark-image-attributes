import { HTML, Image } from 'mdast';
import RootAttributeImage from './attribute-image/root';
import WrappedAttributeImage from './attribute-image/wrapped';

type GatsbyLogger = any;

interface Options {
  styleAttributes?: string[];
  dataAttributes?: boolean;
}

export type Attributes = {
  [key: string]: string;
};

export type AttributeImageNode = (Image | HTML) & {
  title?: string | null;
  value?: string;
};

export type PluginResult = Promise<
  WrappedAttributeImage[],
  RootAttributeImage[]
>;
