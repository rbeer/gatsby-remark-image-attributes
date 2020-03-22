export interface ImageAttributes {
  zoom: boolean;
  width: number | string;
  height: number | string;
  "margin-left": string;
  "margin-right": string;
  "margin-top": string;
  "margin-bottom": string;
  float: "left" | "right";
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
export declare function isGatsbyRemarkImagesHtml(node: any): boolean;

