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
