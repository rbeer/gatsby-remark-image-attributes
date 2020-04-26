const visit = require('unist-util-visit');
const isString = require('lodash.isstring');
const uniq = require('lodash.uniq');

let styleAttributes = [
  'width',
  'height',
  'margin-left',
  'margin-right',
  'margin-top',
  'margin-bottom',
  'float'
];

const applyOptions = ({ styleAttributes: _styleAttributes }, reporter) => {
  if (_styleAttributes) {
    if (!Array.isArray(_styleAttributes)) {
      reporter.warn('Option styleAttributes must be an Array of strings.');
    }
    styleAttributes = uniq(
      styleAttributes.concat(_styleAttributes.filter(isString))
    );
  }
};

const isGatsbyRemarkImagesHtml = (node) => {
  const hasAttributes = !!node.attributes;
  const hasUrl = !!node.url;
  const isImage = /<img/.test(node.value);

  return hasAttributes && hasUrl && isImage;
};

const createStyle = (attributes) => {
  const attributeKeys = Object.keys(attributes);
  return attributeKeys.reduce((styles, attribute) => {
    if (!styleAttributes.includes(attribute)) {
      return styles;
    }
    return `${styles}${attribute}: ${attributes[attribute]};`;
  }, '');
};

const createImgMarkup = ({ attributes, url, alt }) =>
  `<img src="${url}" style="${
    createStyle(attributes) || 'width: 100%;'
  }" alt="${alt}" />`;

const wrapImgMarkup = ({ attributes, value }) =>
  `<span style="display:block; ${createStyle(attributes)}">${value}</span>`;

module.exports = ({ markdownAST, reporter }, options) => {
  applyOptions(options, reporter);

  const gatsbyRemarkImagesHtml = [];
  visit(markdownAST, 'html', (node) => {
    if (isGatsbyRemarkImagesHtml(node)) gatsbyRemarkImagesHtml.push(node);
  });

  const images = [];
  visit(markdownAST, 'image', (node) => {
    // only process images with attributes
    if (node.attributes) {
      images.push(node);
    }
  });

  return Promise.all([
    new Promise((resolve) =>
      resolve(
        images.map((imageNode) => {
          imageNode.type = 'html';
          imageNode.value = createImgMarkup(imageNode);
          return imageNode;
        })
      )
    ),
    new Promise((resolve) =>
      resolve(
        gatsbyRemarkImagesHtml.map((imageNode) => {
          const wrapped = wrapImgMarkup(imageNode);
          imageNode.value = wrapped;
          return imageNode;
        })
      )
    )
  ]);
};
