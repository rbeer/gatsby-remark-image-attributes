const visit = require('unist-util-visit');
const isString = require('lodash.isstring');
const uniq = require('lodash.uniq');

const logMsg = (strings, ...expressions) => {
  const message = strings.reduce(
    (msg, str, idx) => `${msg}${str}${expressions[idx] || ''}`,
    ''
  );
  return `[gatsby-remark-image-attributes] ${message}`;
};

const _options = {
  styleAttributes: [
    'width',
    'height',
    'margin-left',
    'margin-right',
    'margin-top',
    'margin-bottom',
    'float'
  ],
  dataAttributes: false
};

const applyOptions = ({ styleAttributes, dataAttributes }, reporter) => {
  if (styleAttributes) {
    if (Array.isArray(styleAttributes)) {
      _options.styleAttributes = uniq(
        _options.styleAttributes.concat(styleAttributes.filter(isString))
      );
    } else {
      reporter.warn(
        logMsg`Option styleAttributes must be an Array of strings.`
      );
    }
  }

  _options.dataAttributes = dataAttributes === true;
};

const isGatsbyRemarkImagesHtml = (node) => {
  const hasAttributes = !!node.attributes;
  const hasUrl = !!node.url;
  const isImage = /<img/.test(node.value);

  return hasAttributes && hasUrl && isImage;
};

const categorizeAttributes = (attributes) => {
  const styleAttributes = {};
  const dataAttributes = {};

  for (const attributeKey in attributes) {
    if (_options.styleAttributes.includes(attributeKey)) {
      styleAttributes[attributeKey] = attributes[attributeKey];
    } else if (_options.dataAttributes) {
      dataAttributes[attributeKey] = attributes[attributeKey];
    }
  }

  return { styleAttributes, dataAttributes };
};

const createStyle = (styleAttributes) =>
  Object.keys(styleAttributes).reduce(
    (style, key) => `${style}${key}: ${styleAttributes[key]};`,
    ''
  );

const createDataAttributes = (dataAttributes) =>
  Object.keys(dataAttributes).reduce(
    (data, key) => `${data} data-${key}="${dataAttributes[key]}"`,
    ''
  );

const createImgMarkup = ({ attributes, url, alt }) => {
  const { styleAttributes, dataAttributes } = categorizeAttributes(attributes);
  return `<img src="${url}" style="${
    createStyle(styleAttributes) || 'width: 100%;'
  }" alt="${alt}" ${createDataAttributes(dataAttributes)} />`;
};

const wrapImgMarkup = ({ attributes, value }) => {
  const { styleAttributes, dataAttributes } = categorizeAttributes(attributes);
  return `<span style="display:block; ${createStyle(
    styleAttributes
  )}">${value.replace(
    /<img[^>]*/,
    `$& ${createDataAttributes(dataAttributes)}`
  )}</span>`;
};

module.exports = ({ markdownAST, reporter }, options) => {
  applyOptions(options, reporter);

  const gatsbyRemarkImagesHtml = [];
  visit(markdownAST, 'html', (node) => {
    if (isGatsbyRemarkImagesHtml(node)) {
      gatsbyRemarkImagesHtml.push(node);
    }
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
