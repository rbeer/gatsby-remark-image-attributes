import { HTML, Image } from 'mdast';
import AttributeImage from './attribute-image';
import WrappedAttributeImage from './attribute-image/wrapped';
import FigureAttributeImage from './attribute-image/figure';

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
  FigureAttributeImage[],
  AttributeImage[],
  WrappedAttributeImage[]
>;
