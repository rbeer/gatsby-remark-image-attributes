import { AttributeImageNode } from '../index.d';

import AttributeImage from './';

export default class WrappedAttributeImage extends AttributeImage {
  constructor(node: AttributeImageNode) {
    super(node);
  }

  get html(): string {
    this.sanitizeTitle().applyDataAttributes();

    return `<span class="gatsby-img-attributes" style="display:${
      this.attributes.inline ? 'inline-block' : 'block'
    }; ${this.style}">${this.node.value}</span>`;
  }

  static test(node: AttributeImageNode) {
    return (
      !!node.url &&
      /<img/.test(node.value as string) &&
      AttributeImage.hasAttributes(node.title || '')
    );
  }
}
