import { HTML, Image } from 'mdast';
import {
  AttributeImageNode,
  GatsbyLogger,
  Options,
  PluginResult
} from './index.d';

import visit from 'unist-util-visit';
// The nicer folder/index pattern fails with
// TypeError: attribute_image_1.WrappedAttributeImage is not a constructor
// - misconfiguration of TS compiler?␓
import RootAttributeImage from './attribute-image/root';
import WrappedAttributeImage from './attribute-image/wrapped';
import { Node } from 'unist';
import FigureAttributeImage from './attribute-image/figure';

const options: Options = {
  styleAttributes: [],
  dataAttributes: false
};

const logMsg = (strings: TemplateStringsArray, ...expressions: any[]) => {
  const message = strings.reduce(
    (msg, str, idx) => `${msg}${str}${expressions[idx] || ''}`,
    ''
  );
  return `[gatsby-remark-image-attributes] ${message}`;
};

const applyOptions = (
  { styleAttributes, dataAttributes = false }: Options,
  reporter: GatsbyLogger
): void => {
  if (styleAttributes) {
    reporter.warn(
      logMsg`The styleAttributes option is deprecated. The plugin uses all CSS properties.`
    );
  }
  options.dataAttributes = dataAttributes === true;
};

const isImgHtml = (node: AttributeImageNode) =>
  !!node.url && /<img/.test(node.value as string);

const isFigureHtml = (node: AttributeImageNode) =>
  !!node.url && /<figure/.test(node.value as string);

export default (
  { markdownAST, reporter }: { markdownAST: Node; reporter: GatsbyLogger },
  userOptions: Options
): PluginResult => {
  applyOptions(userOptions, reporter);

  const attributeImages: {
    figure: FigureAttributeImage[];
    root: RootAttributeImage[];
    wrapped: WrappedAttributeImage[];
  } = {
    figure: [],
    root: [],
    wrapped: []
  };

  visit(markdownAST, 'image', (node: Image) => {
    // only process images with attributes
    const aimg = new RootAttributeImage(node);
    if (aimg.attributes.length) {
      attributeImages.root.push(aimg);
    }
  });

  visit(markdownAST, 'html', (node: HTML) => {
    if (isFigureHtml(node)) {
      attributeImages.figure.push(new FigureAttributeImage(node));
      return true;
    }
    if (isImgHtml(node)) {
      attributeImages.wrapped.push(new WrappedAttributeImage(node));
      return true;
    }
  });

  return Promise.all([
    new Promise(resolve =>
      resolve(
        attributeImages.figure.map(attributeImage => attributeImage.mdastNode)
      )
    ),
    new Promise(resolve =>
      resolve(
        attributeImages.root.map(attributeImage => attributeImage.mdastNode)
      )
    ),
    new Promise(resolve =>
      resolve(
        attributeImages.wrapped.map(attributeImage => attributeImage.mdastNode)
      )
    )
  ]);
};
