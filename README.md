# gatsby-remark-image-attributes
Creates HTML image markup with style and data-* attributes from [`mdAST Image`](https://github.com/syntax-tree/mdast#image) nodes with attributes in their title.

![Gatsby 2/3/4 compatible](https://badgen.net/badge/Gatsby%202%2C%203%20%26%204/%E2%9C%93/green) ![npm](https://badgen.net/npm/v/gatsby-remark-image-attributes/dev) ![dependencies](https://badgen.net/bundlephobia/dependency-count/gatsby-remark-image-attributes@dev) ![minified](https://badgen.net/bundlephobia/min/gatsby-remark-image-attributes@dev) ![minified+gzip](https://badgen.net/bundlephobia/minzip/gatsby-remark-image-attributes@dev)

```md
                                                 ┌─────────── styleAttributes ───────────┐          reserved for image title
                                                 │ ▼           ▼           ▼             │                ▼
![satisfied](https://foomoji.com/satisfied.png '#width=32px;height=32px;position=absolute;lightbox=true;title=Image Title')
                                                ▲                                             ▲
                                            Leading #                                   dataAttribute
```

yields

```html
<img
  src="https://foomoji.com/satisfied.png"
  alt="satisfied"
  title="Image Title"
  style="width: 32px; height:32px; position: absolute;"
  data-lightbox="true"
  class="gatsby-img-attributes"
/>
```

Note that `title` is a reserved attribute key, i.e. declaring `data-title` is not possible. `title` image attributes will always become the HTML attribute `title` of the `<img>`.

The plugin handles [`mdAST HTML`](https://github.com/syntax-tree/mdast#html) nodes created by [gatsby-remark-images](https://github.com/gatsbyjs/gatsby/master/packages/gatsby-remark-images/); possibly other image-processing plugins. Order of plugins in your gatsby-config matters.

---

Some examples

- [CSS Properties](https://remark-image-attributes.netlify.app/#css-properties)
  * [Positioning](https://remark-image-attributes.netlify.app/#positioning)
  * [SVG](https://remark-image-attributes.netlify.app/#svg)
  * [Inline and Lists](https://remark-image-attributes.netlify.app/#inline-and-lists)
- [data-* attributes](https://remark-image-attributes.netlify.app/#data---attributes)

[![Netlify Status](https://api.netlify.com/api/v1/badges/e80d307e-a042-4e42-a1b2-b339837f84b7/deploy-status)](https://remark-image-attributes.netlify.app) [![demo source](https://badgen.net/badge/source/gatsby-remark-image-attributes-demo/0e1e25)](https://github.com/rbeer/gatsby-remark-image-attributes-demo/tree/gatsby3)

## Installation

```bash
npm install --save gatsby-remark-image-attributes
```

## How to use

- [Basic](https://github.com/rbeer/gatsby-remark-image-attributes/wiki/How-to-use)
- [with gatsby-remark-images](https://github.com/rbeer/gatsby-remark-image-attributes/wiki/How-to-use#gatsby-remark-images)
- [with gatsby-plugin-mdx](https://github.com/rbeer/gatsby-remark-image-attributes/wiki/How-to-use#gatsby-plugin-mdx)

#### .gatsby-img-attributes

Generated markup has a CSS class `gatsby-img-attributes`. The plugin itself does not come with any properties for that class; you can use it to apply default styling to all images with attributes.

## Options

|Name|Type|Default|Description|
|:-:|:-:|:-:|-|
| [dataAttributes](#dataattributes) |Boolean| `false` | Set to `true` if you want attributes not recognized as styleAttribute to be added as data- attribute to the image.
| [styleAttributes](#styleattributes) ||| Deprecated ^1.0.0

#### styleAttributes

_As of v1.0.0, this option is deprecated and the behavior described below will always apply._

The plugin uses a [list of all CSS properties](https://github.com/rbeer/gatsby-remark-image-attributes/blob/master/src/css-props.json), as defined by the [W3C](https://www.w3.org/Style/CSS/all-properties.en.html), to decide whether an attribute is to be added to the image's style or not.

#### dataAttributes

When `options.dataAttributes` is `true`, the plugin will add all attributes whose key isn't a [CSS property](https://www.w3.org/Style/CSS/all-properties.en.html#list) as data-* attribute to the image.

_gatsby-config.js_:

```js
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-image-attributes`,
          options: {
            dataAttributes: true
          }
        }
      ]
    }
  }
];
```
_md_:

```md
![happy](https://foomoji.com/happy.png '#tool-tip=Fancy image with tooltip;position=absolute;height=100px')
```
Where `position` and `height` are recognized as `styleAttributes`, `tool-tip` is not and due to `options.dataAttributes: true` applied as `data-` attribute:

```html
<img
  src="https://foomoji.com/happy.png"
  alt="happy"
  style="position: absolute; height: 100px;"
  data-tool-tip="Fancy image with tooltip"
  class="gatsby-img-attributes"
/>
```

