import { AttributeImageNode } from '../index.d';

import AttributeImage from './attribute-image';

export default class WrappedAttributeImage extends AttributeImage {
  constructor(node: AttributeImageNode) {
    super(node);
  }

  get html(): string {
    const value: string = (this.node.value as string)
      .replace(/<img[^>]*/, `$& ${this.data}`)
      .replace(/title=".*?"/, `title="${this.node.title || ''}"`);

    return `<span class="gatsby-img-attributes" style="display:${
      this.attributes.inline ? 'inline-block' : 'block'
    }; ${this.style}">${value}</span>`;
  }

  get mdastNode() {
    this.node.title = this.attributes.dataAttributes.title || this.node.title;
    if (this.attributes.length && (this.node.title as string).startsWith('#')) {
      this.node.title = null;
    }
    this.node.type = 'html';
    this.node.value = this.html;
    return this.node;
  }
}
