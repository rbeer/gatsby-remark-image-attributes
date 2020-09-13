# gatsby-remark-image-attributes

Creates HTML image markup with style and data-* attributes from 'image' nodes with attributes, as parsed by [remark-image-attributes](https://github.com/rbeer/remark-image-attributes.git).

The plugin plays nicely with other image-processing plugins like [gatsby-remark-images](https://github.com/gatsbyjs/gatsby/master/packages/gatsby-remark-images/), amending their generated markup.

![markdown_html](./sample.png)

Try the [demo](https://remark-image-attributes.netlify.app/)!

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

            // ?Array<String> | Boolean
            //   Any names declared here are added
            //   to the default set of attributes
            //   which the plugin will use to style
            //   the image.
            //   If this is set to true, all CSS
            //   property names will be recognized
            //   as styleAttribute.
            styleAttributes: [`display`, `position`, `border`],

            // ?Boolean
            //   If true, all attributes that
            //   aren't styleAttributes, will be
            //   added as data-* attributes to the
            //   image.
            dataAttributes: true
          }
        }
      ]
    }
  }
],
```

Now you can add attribute declarations as hash value to an image's URL:

```md
![satisfied](https://foomoji.com/satisfied.png#lightbox=true;width=32px;height=32pxi;position=absolute;)
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

## Options

|Name|Type|Default|Description|
|:-:|:-:|:-:|-|
| styleAttributes | Array\<String\> \| Boolean | `['width', 'height', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom', 'float']` | _Array\<String\>_<br />Any valid CSS style name you want to apply to an image. This option adds to the defaults, i.e. it can be omitted when only the defaults are needed. <br /><br />-OR-<br /><br />_Boolean_<br />Add _[all](https://www.w3.org/Style/CSS/all-properties.en.html#list)_ CSS properties to styleAttributes.
| dataAttributes  |Boolean| `false` | Add all attributes not recognized as styleAttribute as data- attribute to the image.

#### .gatsby-img-attributes

Generated markup will always have a CSS class `gatsby-img-attributes`. The plugin itself does not come with any attributes for that class; you can use it freely to apply default styling to all images with attributes.


## Examples

### styleAttributes

You can use the `styleAttributes` option to define CSS style names to be recognized and applied by the plugin.

You can set this to `true` to use [W3's official list of CSS properties](https://www.w3.org/Style/CSS/all-properties.en.html#list) (~530 names) as `styleAttributes`.

---

To add only specific properties to the defaults, declare e.g. `position`, `top` and `left` in your _gatsby-config.js_:

```js
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-image-attributes`,
          options: {
            styleAttributes: [`position`, `top`, `left`]
          }
        }
      ]
    }
  }
];
```

so you then can use them as attributes on an image

```md
![happy](https://foomoji.com/happy.png#position=absolute;top=20px;left=10px)
```

producing

```html
<img
  src="https://foomoji.com/happy.png"
  alt="happy"
  style="position: absolute; top: 20px; left: 10px;"
  class="gatsby-img-attributes"
/>
```

### dataAttributes

When `options.dataAttributes` is `true`, the plugin will add all attributes whose key isn't in `options.styleAttributes` as data-* attribute to the image.

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
![happy](https://foomoji.com/happy.png#tool-tip=Fancy image with tooltip;position=absolute;height=100px)
```
Where `height` is recognized as `styleAttribute` - because it is one of the defaults -, `tool-tip` _and_ `position` are not and thus applied as `dataAttributes`:

```html
<img
  src="https://foomoji.com/happy.png"
  alt="happy"
  style="height: 100px;"
  data-tool-tip="Fancy image with tooltip"
  data-position="absolute"
  class="gatsby-img-attributes"
/>
```

### use with gatsby-remark-images

This plugin can handle already processed images (type: 'html'), as long as the node object contains an `attributes` field and the `value` an `<img />` tag.

So using other image processing plugins, like [gatsby-remark-images](https://github.com/gatsbyjs/gatsby/master/packages/gatsby-remark-images/), is possible:

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
            styleAttributes: [`box-shadow`],
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
![party](./images/emojis/party.png#box-shadow=2px 2px 6px 0px;float=right;foo=bar)
```

generates

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
      title="party"
      src="/static/4d415e7127c0f88799cd9f357aabc732/b7060/party.png"
      data-foo="bar"
      ...
  /></span>
</span>
```

You might have noticed that `styleAttributes` and `class="gatsby-img-attributes"` have been applied to the wrapping `<span>` here, rather than the `<img>`. . See [demo#positioning](https://remark-image-attributes.netlify.app/#positioning) and this [issue comment](https://github.com/rbeer/gatsby-remark-image-attributes/issues/5#issuecomment-690301135) for why this is necessary.

`dataAttributes`, on the other hand, are _always_ applied to the `<img>`.

### use with gatsby-plugin-mdx

If you want to use MDX instead of the bare remark transformer, you have to add `gatsby-remark-image-attributes` to [`options.gatsbyRemarkPlugins`](https://www.gatsbyjs.com/plugins/gatsby-plugin-mdx/#gatsby-remark-plugins) of `gatsby-plugin-mdx`.

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
              styleAttributes: ["box-shadow", "position"]
            }
          }
        ]
      }
    },
```
