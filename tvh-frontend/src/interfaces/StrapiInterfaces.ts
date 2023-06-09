export interface StrapiPaginationParams {
  'pagination[page]'?: number,
  'pagination[pageSize]'?: number,
  'pagination[withCount]'?: boolean,
}

export interface StrapiMetaPagination {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

export interface StrapiGeneral {
  id: number;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
}

export interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: null;
  width: number;
  height: number;
  size: number;
  url: string;
}

export interface StrapiImageFormats {
  thumbnail: StrapiImageFormat;
  small: StrapiImageFormat;
  medium: StrapiImageFormat;
  large: StrapiImageFormat;
}

export interface StrapiImage {
  id?: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats: StrapiImageFormats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: string;
  createdAt: Date;
  updatedAt: Date;
}
