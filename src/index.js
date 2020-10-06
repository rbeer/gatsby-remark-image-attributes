const visit = require('unist-util-visit');
const isString = require('lodash.isstring');
const uniq = require('lodash.uniq');
const imageAttributesParser = require('remark-image-attributes');

const allCSSProperties = require('./css-props.json');

const logMsg = (strings, ...expressions) => {
  const message = strings.reduce(
    (msg, str, idx) => `${msg}${str}${expressions[idx] || ''}`,
    ''
  );
  return `[gatsby-remark-image-attributes] ${message}`;
};

const options = {
  styleAttributes: [],
  dataAttributes: false
};

const applyOptions = (
  { styleAttributes = true, dataAttributes = false },
  reporter
) => {
  const styleAttributesIsArray = Array.isArray(styleAttributes);
  if (styleAttributesIsArray) {
    reporter.warn(
      logMsg`Passing Array<String> to styleAttributes is deprecated.`
    );
    reporter.warn(logMsg`Using all CSS properties.`);
  }
  options.styleAttributes =
    styleAttributes === true || styleAttributesIsArray ? allCSSProperties : [];

  options.dataAttributes = dataAttributes === true;
};

const isImageHtml = node => {
  const hasAttributes = !!node.attributes;
  const hasUrl = !!node.url;
  const isImage = /<img/.test(node.value);

  return hasAttributes && hasUrl && isImage;
};

const categorizeAttributes = attributes => {
  const styleAttributes = {};
  const dataAttributes = {};

  for (const attributeKey in attributes) {
    if (options.styleAttributes.includes(attributeKey)) {
      styleAttributes[attributeKey] = attributes[attributeKey];
    } else if (options.dataAttributes) {
      dataAttributes[attributeKey] = attributes[attributeKey];
    }
  }

  return { styleAttributes, dataAttributes };
};

const createStyle = (styleAttributes, inline) => {
  let styleString = Object.keys(styleAttributes).reduce(
    (style, key) => `${style}${key}: ${styleAttributes[key]};`,
    ''
  );

  if (inline && !styleAttributes.width && !styleAttributes.height) {
    styleString += 'width: 100%;';
  }
  return styleString;
};

const createDataAttributes = dataAttributes =>
  Object.keys(dataAttributes).reduce(
    (data, key) => `${data} data-${key}="${dataAttributes[key]}"`,
    ''
  );

const createImgMarkup = ({ attributes, url, alt, inline }) => {
  const { styleAttributes, dataAttributes } = categorizeAttributes(attributes);
  return `<img src="${url}" class="gatsby-img-attributes" style="${
    createStyle(styleAttributes, inline) || 'width: 100%;'
  }" alt="${alt}" ${createDataAttributes(dataAttributes)} />`;
};

const wrapImgMarkup = ({ attributes, value, inline }) => {
  const { styleAttributes, dataAttributes } = categorizeAttributes(attributes);
  return `<span class="gatsby-img-attributes" style="display:${
    inline ? 'inline-block' : 'block'
  }; ${createStyle(styleAttributes, inline)}">${value.replace(
    /<img[^>]*/,
    `$& ${createDataAttributes(dataAttributes)}`
  )}</span>`;
};

module.exports = ({ markdownAST, reporter }, userOptions) => {
  applyOptions(userOptions, reporter);

  const imageHtml = [];
  visit(markdownAST, 'html', node => {
    if (isImageHtml(node)) {
      imageHtml.push(node);
    }
  });

  const images = [];
  visit(markdownAST, 'image', node => {
    // only process images with attributes
    if (node.attributes) {
      images.push(node);
    }
  });

  return Promise.all([
    new Promise(resolve =>
      resolve(
        images.map(imageNode => {
          imageNode.type = 'html';
          imageNode.value = createImgMarkup(imageNode);
          return imageNode;
        })
      )
    ),
    new Promise(resolve =>
      resolve(
        imageHtml.map(imageNode => {
          const wrapped = wrapImgMarkup(imageNode);
          imageNode.value = wrapped;
          return imageNode;
        })
      )
    )
  ]);
};

module.exports.setParserPlugins = () => [imageAttributesParser];
