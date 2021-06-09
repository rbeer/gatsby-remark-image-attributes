import { HTML, Image } from 'mdast';
import { AttributeImageNode, GatsbyLogger, Options } from './index.d';

import visit from 'unist-util-visit';

import { RootAttributeImage, WrappedAttributeImage } from './attribute-image';

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

const isImageHtml = (node: AttributeImageNode) =>
  !!node.url && /<img/.test(node.value as string);

export default (
  { markdownAST, reporter }: { markdownAST: any; reporter: GatsbyLogger },
  userOptions: Options
) => {
  applyOptions(userOptions, reporter);

  const imageHtml: WrappedAttributeImage[] = [];
  visit(markdownAST, 'html', (node: HTML) => {
    if (isImageHtml(node)) {
      imageHtml.push(new WrappedAttributeImage(node));
    }
  });

  const images: RootAttributeImage[] = [];
  visit(markdownAST, 'image', (node: Image) => {
    // only process images with attributes
    const aimg = new RootAttributeImage(node);
    if (aimg.attributes) {
      images.push(aimg);
    }
  });

  console.log(
    'images',
    images.map(attributeImage => attributeImage.mdastNode)
  );
  // @ts-ignore
  //process.exit();

  return Promise.all([
    new Promise(resolve =>
      resolve(images.map(attributeImage => attributeImage.mdastNode))
    ),
    new Promise(resolve =>
      resolve(imageHtml.map(attributeImage => attributeImage.mdastNode))
    )
  ]);
};
