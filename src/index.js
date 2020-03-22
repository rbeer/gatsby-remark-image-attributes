const visit = require("unist-util-visit");
const isArray = require("lodash.isarray");
const isString = require("lodash.isstring");
const uniq = require("lodash.uniq");
const $ = require("cheerio");

let styleAttributes = [
  "width",
  "height",
  "margin-left",
  "margin-right",
  "margin-top",
  "margin-bottom",
  "float"
];

const applyOptions = ({ styleAttributes: _styleAttributes }, reporter) => {
  if (_styleAttributes) {
    if (!isArray(_styleAttributes)) {
      reporter.warn("Option styleAttributes must be an Array of strings.");
    }
    styleAttributes = uniq(
      styleAttributes.concat(_styleAttributes.filter(isString))
    );
  }
};

const isGatsbyRemarkImagesHtml = node => {
  const hasAttributes = !!node.attributes;
  const hasUrl = !!node.url;
  const isImage = /<img/.test(node.value);

  return hasAttributes && hasUrl && isImage;
};

const createStyle = attributes => {
  const attributeKeys = Object.keys(attributes);
  return attributeKeys.reduce((styles, attribute) => {
    if (!styleAttributes.includes(attribute)) {
      return styles;
    }
    return `${styles}${attribute}: ${attributes[attribute]};`;
  }, "");
};

const createImgMarkup = ({ attributes, url, alt }) => `
  <img
    src="${url}"
    style="${createStyle(attributes) || "width: 100%;"}"
    alt="${alt}"
  />
  `;

const amendImgMarkup = ({ attributes, value }) => {
  const $fullMarkup = $.load(`<span style="display:block">${value}</span>`, {
    xmlMode: true
  });
  $fullMarkup("img").attr({ style: createStyle(attributes) });
  console.log($fullMarkup.html());
  return $fullMarkup.html();
};

module.exports = ({ markdownAST, reporter }, options) => {
  applyOptions(options, reporter);

  const gatsbyRemarkImagesHtml = [];
  visit(markdownAST, "html", node => {
    if (isGatsbyRemarkImagesHtml(node)) gatsbyRemarkImagesHtml.push(node);
  });

  const images = [];
  visit(markdownAST, "image", node => {
    // only process images with attributes
    if (!!node.attributes) {
      images.push(node);
    }
  });

  return Promise.all([
    new Promise(resolve =>
      resolve(
        images.map(imageNode => {
          imageNode.type = "html";
          imageNode.value = createImgMarkup(imageNode);
          return imageNode;
        })
      )
    ),
    new Promise(resolve =>
      resolve(
        gatsbyRemarkImagesHtml.map(imgNode => {
          const amended = amendImgMarkup(imgNode);
          imgNode.value = amended;
          return imgNode;
        })
      )
    )
  ]);
};
