import { AttributeImageNode } from '../index.d';

import AttributeImage from './attribute-image';

export default class RootAttributeImage extends AttributeImage {
  constructor(node: AttributeImageNode) {
    super(node);
  }

  get html(): string {
    return `<img src="${this.node.url}" class="gatsby-img-attributes" style="${
      this.style || 'width: 100%;'
    }" alt="${this.node.alt}" title="${this.node.title || ''}"${this.data}/>`;
  }

  get mdastNode() {
    this.node.title =
      this.attributes.dataAttributes.title || this.node.title || '';
    if (this.attributes.length && (this.node.title as string).startsWith('#')) {
      this.node.title = null;
    }
    this.node.type = 'html';
    this.node.value = this.html;

    return this.node;
  }
}
