import { Attributes, AttributeImageNode } from './index.d';

import { default as allCSSProperties } from './css-props.json';

export default class ImageAttributes {
  inline: boolean;
  attributes: Attributes = {};
  styleAttributes: Attributes = {};
  dataAttributes: Attributes = {};

  constructor(node: AttributeImageNode) {
    this.parse(node).categorizeAttributes();
    this.inline = (node.position?.start?.column || 0) > 1;
  }

  categorizeAttributes() {
    this.dataAttributes = {};
    this.styleAttributes = {};

    for (const attributeKey in this.attributes) {
      if (allCSSProperties.includes(attributeKey)) {
        this.styleAttributes[attributeKey] = this.attributes[attributeKey];
      } else {
        this.dataAttributes[attributeKey] = this.attributes[attributeKey];
      }
    }

    return this;
  }

  parse(node: AttributeImageNode) {
    const rxp = /^#(.*?)=(.*?);?/;
    const title = node.title ? (node.title as string).trim() : null;
    if (!title || !rxp.test(title)) {
      return this;
    }

    this.attributes = (node.title as string)
      .slice(1)
      .split(';')
      .reduce((attrs, attr) => {
        const [key, val] = attr.split('=');
        if (!val || !key) return attrs;
        return {
          ...attrs,
          [key]: val
        };
      }, {});

    return this;
  }

  get length() {
    return Object.keys(this.attributes).length;
  }
}
