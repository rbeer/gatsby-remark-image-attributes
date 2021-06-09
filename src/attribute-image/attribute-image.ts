import { AttributeImageNode } from './index.d';

import ImageAttributes from './image-attributes';

abstract class AttributeImage {
  node: AttributeImageNode;
  attributes: ImageAttributes;

  constructor(node: AttributeImageNode) {
    this.node = node;
    this.attributes = new ImageAttributes(node);
  }

  get width(): string {
    const defaultWidth = ['', '100%'];
    const value = this.node.value as string;
    if (!value) {
      return defaultWidth[1];
    }
    return (value.match(/width: (\d*(px|%|vw))/) || defaultWidth)[1];
  }

  get data(): string {
    return Object.keys(this.attributes.dataAttributes).reduce(
      (value, key) =>
        key !== 'title'
          ? `${value} data-${key}="${this.attributes.dataAttributes[key]}"`
          : '',
      ''
    );
  }

  get style(): string {
    let styleString = Object.keys(this.attributes.styleAttributes).reduce(
      (style, key) =>
        `${style}${key}: ${this.attributes.styleAttributes[key]};`,
      ''
    );

    if (
      this.attributes.inline &&
      !this.attributes.styleAttributes.width &&
      !this.attributes.styleAttributes.height
    ) {
      styleString += `width: ${this.width};`;
    }
    return styleString;
  }

  abstract get html(): string;
  abstract get mdastNode(): AttributeImageNode;
}
export default AttributeImage;
