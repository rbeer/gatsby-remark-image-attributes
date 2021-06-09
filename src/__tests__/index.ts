import { PluginResult, Options } from '../index.d';

import remark from 'remark';
// @ts-ignore
import remarkImages from 'gatsby-remark-images';
import { Node } from 'unist';

import plugin from '../';

const warnDummy = jest.fn();

const parse = (content: string): Node => remark().parse(content);

const run = async (md: string, options: Options = {}): PluginResult =>
  plugin({ markdownAST: parse(md), reporter: { warn: warnDummy } }, options);

describe.only('Given mdAST Image nodes', () => {
  it('warns about styleAttributes option being deprecated', async () => {
    const [[image]] = await run("![remove](./remove.png '#height=10px')", {
      styleAttributes: []
    });
    expect(warnDummy).toHaveBeenCalledWith(
      '[gatsby-remark-image-attributes] The styleAttributes option is deprecated. The plugin uses all CSS properties.'
    );
    expect(image.value).toMatchSnapshot();
  });

  it('ignores images without title', async () => {
    const [[image]] = await run('![no title](./none.png)');
    expect(image.title).toEqual('');
    expect(image.value).toMatchSnapshot();
  });

  it('ignores titles without key=value; pairs', async () => {
    const [[image]] = await run(
      "![title](./title.png '#standard syntax title')"
    );
    expect(image.title).toEqual('#standard syntax title');
    expect(image.value).toMatchSnapshot();
  });

  it('removes attributes from the title', async () => {
    const [[image]] = await run("![remove](./remove.png '#height=10px')");
    expect(image.title).toBe(null);
    expect(image.value).toMatchSnapshot();
  });

  it('sets title to value of a title= attribute', async () => {
    const [[image]] = await run(
      "![fromAttribute](./attribute.png '#width=32px;title=title from attribute;color=blue')"
    );
    expect(image.title).toEqual('title from attribute');
    expect(image.value).toMatchSnapshot();
  });

  it("doesn't trip over values with spaces", async () => {
    const [[image]] = await run(
      "![gatsby](./gatsby-logo.png '#width=10px;color=rgb(10, 10, 10)')"
    );
    expect(image.value).toMatch(
      /style="width: 10px;color: rgb\(10, 10, 10\);"/
    );
    expect(image.value).toMatchSnapshot();
  });

  it("adds plugin's CSS class", async () => {
    const [[image]] = await run(
      "![gatsby](./gatsby-logo.png '#width=10px;color=rgb(10, 10, 10)')"
    );
    expect(image.value).toMatch(/class="gatsby-img-attributes"/);
    expect(image.value).toMatchSnapshot();
  });
});

//it('applies inline-block style to inline images', async () => {
//const [, [image]] = await run(
//"inline ![inline](./inline.png '#width=32px;title=title from attribute') image"
//);
//expect(image.title).toEqual('title from attribute');
//expect(image.value).toMatch(/display: inline-block/);
//expect(image.value).toMatchSnapshot();
//});
