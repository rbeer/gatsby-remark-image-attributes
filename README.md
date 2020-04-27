# gatsby-remark-image-attributes

Creates HTML image markup with style attributes. Those attributes are expected on the markdownAST 'image' node, as parsed by [remark-image-attributes](https://github.com/rbeer/remark-image-attributes.git).

The plugin plays nicely with other image-processing plugins like [gatsby-remark-images](https://github.com/gatsbyjs/gatsby/master/packages/gatsby-remark-images/), amending their generated markup by wrapping it in a container, styled with your attributes.

## Installation

```bash
npm install --save gatsby-remark-image-attributes remark-image-attributes
```

## How to use

Add both plugins ([remark-image-attributes](https://github.com/rbeer/remark-image-attributes.git) and [gatsby-remark-image-attributes](https://github.com/rbeer/gatsby-remark-image-attributes.git)) to your

_gatsby-config.js_

```js
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        // markdown parser for attributes on images
        //   This is a non-optional depdendency
        `remark-image-attributes`,
        {
          resolve: `gatsby-remark-image-attributes`,
          options: {
            // Optional, any valid CSS style name
            //   Any names declared here are added
            //   to the default set of attributes
            styleAttributes: [`display`, `position`, `border`]
          }
        }
      ]
    }
  }
],
```

Now you can add attribute declarations as hash value to the image URL:

```md
![satisfied](https://foomoji.com/satisfied.png#width=32px;height=32pxi;position=absolute;)
```

The resulting HTML will be:

```html
<img
  src="https://foomoji.com/satisfied.png"
  alt="satisfied"
  style="width: 32px; height:32px; position: absolute;"
/>
```

## Options

|      Name       |                                         Default                                          | Description                                                                                                                               |
| :-------------: | :--------------------------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------------------------- |
| styleAttributes | `width`, `height`, `margin-left`, `margin-right`, `margin-top`, `margin-bottom`, `float` | Array with any valid CSS-style name you want to put on the `style` attribute of an image. See [styleAttributes example](#styleattributes) |

## Examples

### styleAttributes

You can use the `styleAttributes` option to define CSS-style names to be recognized and applied by the plugin.

To be, for example, able to absolutely position images, declare the attributes `position`, `top` and `left` in your

_gatsby-config.js_:

```js
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        `remark-image-attributes`, // the markdown parser
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
/>
```

### use with gatsby-remark-images

This plugin can handle already processed images (type: 'html'), as long as the node object contains an `attributes` field and the `value` an `<img />` tag.

So using other plugins, like [gatsby-remark-images](https://github.com/gatsbyjs/gatsby/master/packages/gatsby-remark-images/), is possible:

_gatsby-config.js_

```js
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: "gatsby-remark-images",
          options: {
            backgroundColor: "none",
            disableBgImage: true
          }
        },
        {
          resolve: "gatsby-remark-image-attributes"
        }
      ]
    }
  }
],
```

and

```md
![party](./images/emojis/party.png#box-shadow=2px 2px 6px 0px;float=right)
```

generates

```html
<span style="box-shadow: 2px 2px 6px 0px; float: right;">
  <span class="gatsby-resp-image-wrapper" ...>
    <span class="gatsby-resp-image-background-image" ...></span>
    <img
      class="gatsby-resp-image-image"
      alt="party"
      title="party"
      src="/static/4d415e7127c0f88799cd9f357aabc732/b7060/party.png"
      ...
  /></span>
</span>
```

### use with gatsby-plugin-mdx

```js
{
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [".mdx", ".md"],
        remarkPlugins: [
          require("remark-image-attributes"),
        ],
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
