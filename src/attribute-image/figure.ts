import { AttributeImageNode } from '../index.d';

import AttributeImage from './';

export default class FigureAttributeImage extends AttributeImage {
  constructor(node: AttributeImageNode) {
    super(node);
  }

  get html(): string {
    this.sanitizeTitle().applyDataAttributes();

    return `<div class="gatsby-img-attributes" style="${this.style}">${this.node.value}</div>`;
  }

  static test(node: AttributeImageNode) {
    return (
      !!node.url &&
      /<figure/.test(node.value as string) &&
      AttributeImage.hasAttributes(node.title || '')
    );
  }
}
