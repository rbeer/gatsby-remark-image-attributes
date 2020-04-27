export interface ImageAttributes {
  [string]: any;
}

export type AmendImgMarkupParameters = {
  attributes: ImageAttributes;
  value: string;
};

export type CreateImgMarkupParameters = {
  attributes: ImageAttributes;
  url: string;
  alt: string;
};

export declare function amendImgMarkup(p: AmendImgMarkupParameters): string;
export declare function createImgMarkup(p: CreateImgMarkupParameters): string;
export declare function createStyle(attributes: ImageAttributes): string;
export declare function createDataAttributes(
  attributes: ImageAttributes
): string;
export declare function isGatsbyRemarkImagesHtml(node: any): boolean;
