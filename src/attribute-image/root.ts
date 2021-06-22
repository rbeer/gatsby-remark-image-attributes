import { AttributeImageNode } from '../index.d';

import AttributeImage from './attribute-image';

export default class RootAttributeImage extends AttributeImage {
  constructor(node: AttributeImageNode) {
    super(node);
  }

  get html(): string {
    this.sanitizeTitle();

    return `<img src="${this.node.url}" class="gatsby-img-attributes" style="${
      this.style || 'width: 100%;'
    }" alt="${this.node.alt}" title="${this.node.title || ''}"${this.data}/>`;
  }
}
