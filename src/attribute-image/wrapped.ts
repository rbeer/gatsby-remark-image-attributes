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
}
