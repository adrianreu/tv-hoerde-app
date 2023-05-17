import { StrapiPaginationParams } from 'src/interfaces/StrapiInterfaces';

function mapDataObject(data: any) {
  if (!data) return undefined;
  let mappedData: any = {};
  mappedData.id = data.id;
  const { attributes } = data;
  mappedData = { ...mappedData, ...data.attributes };
  Object.keys(attributes).forEach((key) => {
    if (typeof attributes[key] === 'object' && attributes[key]?.data) {
      // eslint-disable-next-line no-use-before-define
      mappedData[key] = mapStrapiData(attributes[key].data);
    }
  });
  return mappedData;
}

export function mapStrapiData(data: any) {
  if (!data) return undefined;
  if (Array.isArray(data)) {
    return data.map((item) => mapDataObject(item));
  }
  return mapDataObject(data);
}

export function toStrapiPagination(
  page: number,
  pageSize = 10,
  withCount = true,
): StrapiPaginationParams {
  return {
    'pagination[page]': page,
    'pagination[pageSize]': pageSize,
    'pagination[withCount]': withCount,
  };
}

export function mapStrapiRequestData(data: any): any {
  if (!data) return undefined;
  const cleanedData: any = { ...data, id: undefined };
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === 'object') {
      cleanedData[key] = data[key].id || -1;
    }
    if (Array.isArray(data[key])) {
      cleanedData[key] = data[key].map((item: any) => item.id) || [];
    }
  });
  return cleanedData;
}
