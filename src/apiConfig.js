export const baseURL = "http://110.38.226.9:4000";
export const apiURL = "http://110.38.226.9:4000/EngineAPI/Query/GetData";

export const getDataURL = (queryKey, additionalProp1) => {
  return `${apiURL}?queryKey=${queryKey}&additionalProp1=${additionalProp1}`;
};