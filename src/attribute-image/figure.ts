import { AttributeImageNode } from '../index.d';

import AttributeImage from './attribute-image';

export default class FigureAttributeImage extends AttributeImage {
  constructor(node: AttributeImageNode) {
    super(node);
  }

  get html(): string {
    this.sanitizeTitle();
    this.applyDataAttributes();
    return `<div class="gatsby-img-attributes" style="${this.style}">${this.node.value}</div>`;
  }
}
