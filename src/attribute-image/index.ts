import { AttributeImageNode } from '../index.d';

import ImageAttributes from '../image-attributes';

class AttributeImage {
  node: AttributeImageNode;
  attributes: ImageAttributes;

  constructor(node: AttributeImageNode) {
    this.node = node;
    this.attributes = new ImageAttributes(node);
  }

  get width(): string {
    const defaultWidth = ['', '100%'];
    const value = this.node.value as string;
    return (value.match(/width: (\d*(px|%|vw))/) || defaultWidth)[1];
  }

  get data(): string {
    return Object.keys(this.attributes.dataAttributes).reduce(
      (value, key) =>
        key !== 'title'
        ? `${value} data-${key}="${this.attributes.dataAttributes[key]}"`
        : value,
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

  get mdastNode() {
    this.node.type = 'html';
    this.node.value = this.html;
    return this.node;
  }

  get html(): string {
    this.sanitizeTitle();

    return `<img src="${this.node.url}" class="gatsby-img-attributes" style="${
      this.style || 'width: 100%;'
    }" alt="${this.node.alt}" title="${this.node.title || ''}"${this.data}/>`;
  }

  applyDataAttributes() {
    this.node.value = (this.node.value as string).replace(
      /<img[^>]*/,
      `$& ${this.data}`
    );
    return this;
  }

  sanitizeTitle() {
    this.node.title = this.attributes.dataAttributes.title || this.node.title;
    if (this.attributes.length && (this.node.title as string).startsWith('#')) {
      this.node.title = null;
    }

    if (this.node.value && this.attributes.originalTitle) {
      const rx = new RegExp(
        `#?${this.attributes.originalTitle.replace(
          /[\/\\^$*+?.()|[\]{}]/g,
          '\\$&'
        )}`,
        'g'
      );
      this.node.value = (this.node.value as string).replace(
        rx,
        this.node.title || ''
      );
    }
    return this;
  }

  static hasAttributes(title: string): boolean {
    return /^#(.*?)=(.*?);?/.test(title);
  }
}

export default AttributeImage;
