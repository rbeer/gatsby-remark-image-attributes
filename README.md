# gatsby-remark-image-attributes

Creates HTML image markup with style and data-* attributes from [`mdAST Image`](https://github.com/syntax-tree/mdast#image) nodes with attributes in their title.

The plugin handles [`mdAST HTML`](https://github.com/syntax-tree/mdast#html) nodes, created by [gatsby-remark-images](https://github.com/gatsbyjs/gatsby/master/packages/gatsby-remark-images/); possibly other image-processing plugins.

---
### [Demo](https://remark-image-attributes.netlify.app/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/e80d307e-a042-4e42-a1b2-b339837f84b7/deploy-status)](https://app.netlify.com/sites/remark-image-attributes/deploys) [*source*](https://github.com/rbeer/gatsby-remark-image-attributes-demo)

Some examples

- [CSS Properties](https://remark-image-attributes.netlify.app/#css-properties)
  * [Positioning](https://remark-image-attributes.netlify.app/#positioning)
  * [SVG](https://remark-image-attributes.netlify.app/#svg)
  * [Inline and Lists](https://remark-image-attributes.netlify.app/#inline-and-lists)
- [data-* attributes](https://remark-image-attributes.netlify.app/#data---attributes)

## Installation

```bash
npm install --save gatsby-remark-image-attributes
```

## How to use

Add `gatsby-remark-image-attributes` as plugin to [gatsby-transformer-remark](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-remark) in _gatsby-config.js_

```js
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-image-attributes`,
          options: {
            // ?Boolean=false
            //   If true, all attributes that
            //   aren't styleAttributes, will be
            //   added as data-* attributes to the
            //   image.
            dataAttributes: false
          }
        }
      ]
    }
  }
],
```

Now you can add attribute declarations as hash value to an image's title:

```md
![satisfied](https://foomoji.com/satisfied.png '#lightbox=true;width=32px;height=32pxi;position=absolute;')
```

The resulting HTML will be:

```html
<img
  src="https://foomoji.com/satisfied.png"
  alt="satisfied"
  style="width: 32px; height:32px; position: absolute;"
  data-lightbox="true"
  class="gatsby-img-attributes"
/>
```

#### styleAttributes

The plugin uses a [list of all CSS properties](https://github.com/rbeer/gatsby-remark-image-attributes/blob/master/src/css-props.json), as defined by the [W3C](https://www.w3.org/Style/CSS/all-properties.en.html), to decide whether an attribute is to be added to the image's style or not.

#### .gatsby-img-attributes

Generated markup has a CSS class `gatsby-img-attributes`. The plugin itself does not come with any attributes for that class; you can use it to apply default styling to all images with attributes.

## Options

|Name|Type|Default|Description|
|:-:|:-:|:-:|-|
| [dataAttributes](#dataattributes) |Boolean| `false` | Set to `true` if you want attributes not recognized as styleAttribute to be added as data- attribute to the image.
| [styleAttributes](#styleattributes) ||| Deprecated ^1.0.0

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

### use with gatsby-remark-images

This plugin can handle already processed images (type: 'html'), as long as the node object contains a `url` field and the `value` an `<img />` tag.

_gatsby-config.js_

```js
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: 'gatsby-remark-images',
          options: {
            backgroundColor: 'none',
            disableBgImage: true
          }
        },
        {
          resolve: `gatsby-remark-image-attributes`,
          options: {
            dataAttributes: true
          }
        }
      ]
    }
  }
]
```

and

```md
![party](./images/emojis/party.png '#box-shadow=2px 2px 6px 0px;float=right;foo=bar;title=\o/')
```

generate

```html
<span
  style="display:block; box-shadow: 2px 2px 6px 0px; float: right;"
  class="gatsby-img-attributes"
>
  <span class="gatsby-resp-image-wrapper" ...>
    <span class="gatsby-resp-image-background-image" ...></span>
    <img
      class="gatsby-resp-image-image"
      alt="party"
      title="\o/"
      src="/static/4d415e7127c0f88799cd9f357aabc732/b7060/party.png"
      data-foo="bar"
      ...
  /></span>
</span>
```

`styleAttributes` and `class="gatsby-img-attributes"` have been applied to the wrapping `<span>` here, rather than the `<img>`. `dataAttributes`, on the other hand, are _always_ applied to the `<img>`.

See [demo#positioning](https://remark-image-attributes.netlify.app/#positioning) and this [issue comment](https://github.com/rbeer/gatsby-remark-image-attributes/issues/5#issuecomment-690301135) for why this is necessary.



### use with gatsby-plugin-mdx

Add `gatsby-remark-image-attributes` to [`options.gatsbyRemarkPlugins`](https://www.gatsbyjs.com/plugins/gatsby-plugin-mdx/#gatsby-remark-plugins) of `gatsby-plugin-mdx`.

_gatsby-config.js_
```js
{
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [".mdx", ".md"],
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {
              ignoreFileExtensions: ["png", "jpg", "jpeg"]
            }
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              backgroundColor: "none",
              disableBgImage: true,
              linkImagesToOriginal: false
            }
          },
          {
            resolve: "gatsby-remark-image-attributes",
            options: {
              // dataAttributes: false
            }
          }
        ]
      }
    },
```
