import { PluginResult, Options } from '../index.d';

import remark from 'remark';
import { Node } from 'unist';

import plugin from '../';
import { CSS_CLASS } from '../constants';
import gatsbyRemarkImagesFixtures from './__fixtures__/gatsby-remark-images.json';

const warnDummy = jest.fn();

const parse = (content: string): Node => remark().parse(content);

const run = async (md: string | Node, options: Options = {}): PluginResult =>
  plugin(
    {
      markdownAST: typeof md === 'string' ? parse(md) : md,
      reporter: { warn: warnDummy }
    },
    options
  );

describe('Given the userOption styleAttributes', () => {
  it('warns about styleAttributes option being deprecated', async () => {
    const [, [image]] = await run("![remove](./remove.png '#height=10px')", {
      styleAttributes: []
    });
    expect(warnDummy).toHaveBeenCalledWith(
      '[gatsby-remark-image-attributes] The styleAttributes option is deprecated. The plugin uses all CSS properties.'
    );
    expect(image.value).toMatchSnapshot();
  });
});

describe('Given mdAST Image nodes', () => {
  it('ignores images without title', async () => {
    const [, [image]] = await run('![no title](./none.png)');
    expect(image).toBe(undefined);
  });

  it('ignores titles without key=value; pairs', async () => {
    const [, [image]] = await run(
      "![title](./title.png '#standard syntax title')"
    );
    expect(image).toBe(undefined);
  });

  it('removes attributes from the title', async () => {
    const [, [image]] = await run("![remove](./remove.png '#height=10px')");
    expect(image.title).toBe(null);
    expect(image.value).toMatchSnapshot();
  });

  it('sets title to value of a title= attribute', async () => {
    const [, [image]] = await run(
      "![fromAttribute](./attribute.png '#width=32px;title=title from attribute;color=blue')"
    );
    expect(image.title).toEqual('title from attribute');
    expect(image.value).toMatchSnapshot();
  });

  it("doesn't trip over values with spaces", async () => {
    const [, [image]] = await run(
      "![gatsby](./gatsby-logo.png '#width=10px;color=rgb(10, 10, 10)')"
    );
    expect(image.value).toMatch(
      /style="width: 10px;color: rgb\(10, 10, 10\);"/
    );
    expect(image.value).toMatchSnapshot();
  });

  it("adds plugin's CSS class to the image", async () => {
    const [, [image]] = await run(
      "![gatsby](./gatsby-logo.png '#width=10px;color=rgb(10, 10, 10)')"
    );
    expect(image.value).toMatch(
      new RegExp(`^<img.*?class="${CSS_CLASS}".*?\/>`)
    );
    expect(image.value).toMatchSnapshot();
  });
});

describe('Given mdAST HTML nodes', () => {
  it('ignores nodes without <img>', async () => {
    const [, , [image]] = await run(gatsbyRemarkImagesFixtures.notAnImage.node);
    expect(image).toBe(undefined);
  });

  describe('from gatsby-remark-images', () => {
    let titleAttributeResult: PluginResult;
    let styleAttributesResult: PluginResult;
    beforeAll(async () => {
      titleAttributeResult = await run(
        gatsbyRemarkImagesFixtures.titleAttribute.node
      );
      styleAttributesResult = await run(
        gatsbyRemarkImagesFixtures.styleAttributes.node
      );
    });

    it('ignores titles without key=value; pairs', async () => {
      const [, , [image]] = await run(
        gatsbyRemarkImagesFixtures.noAttributes.node
      );
      expect(image.title).toEqual('No attributes, here');
      expect(image.value).toMatch('title="No attributes, here"');
      expect(image.value).toMatchSnapshot();
    });

    it('removes attributes from the title', async () => {
      const [, , [image]] = styleAttributesResult;
      expect(image.title).toBe(null);
      expect(image.value).toMatch('title=""');
      expect(image.value).toMatchSnapshot();
    });

    it('sets title to value of a title= attribute', async () => {
      const [, , [image]] = titleAttributeResult;
      expect(image.title).toEqual('Title from imageAttribute');
      expect(image.value).toMatch('title="Title from imageAttribute"');
      expect(image.value).toMatchSnapshot();
    });

    it("adds plugin's CSS class to the wrapper", async () => {
      const [, , [image]] = titleAttributeResult;
      expect(image.value).toMatch(new RegExp(`^<span class="${CSS_CLASS}"`));
      expect(image.value).toMatchSnapshot();
    });

    it('applies inline-block style to inline image wrappers', async () => {
      const [, , [image]] = styleAttributesResult;
      const [, , [inlineImage]] = titleAttributeResult;
      expect(inlineImage.value).toMatch(
        /^<span.*?style="display:inline-block.*?>/
      );
      expect(image.value).toMatch(/^<span.*?style="display:block.*?>/);
      expect(image.value).toMatchSnapshot();
    });

    describe('with showCaption option', () => {
      let figureImage: PluginResult;
      beforeAll(async () => {
        [[figureImage]] = await run(gatsbyRemarkImagesFixtures.figure.node);
      });

      it('wraps with a <div>', () => {
        expect(figureImage.value).toMatch(
          new RegExp(`^<div class="${CSS_CLASS}"`)
        );
        expect(figureImage.value).toMatchSnapshot();
      });

      it('sanitizes title=""', () => {
        expect(figureImage.value).toMatch(
          /title="This has a title from image attributes"/
        );
      });

      it('sanitizes the <figcaption>', () => {
        expect(figureImage.value).toMatch(
          /<figcaption.*?>This has a title from image attributes<\/figcaption>/
        );
      });
    });
  });
});
