import {isEmpty} from "lodash/lang.js";

export const parseFilters = (filterString) => {
  if (isEmpty(filterString)) return {};

  return filterString.split(",").reduce((acc, pair) => {
    const [key, value] = pair.split(":");
    const parsedValue =
      value === "true" ? true : value === "false" ? false : value; // Parse boolean strings
    if (!acc[key]) {
      acc[key] = parsedValue;
    } else if (Array.isArray(acc[key])) {
      acc[key].push(parsedValue);
    } else {
      acc[key] = [acc[key], parsedValue];
    }
    return acc;
  }, {});
};

export const stringifyFilters = (filterObject) => {
  return Object.entries(filterObject)
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${key}:${v}`);
      }
      return `${key}:${value}`;
    })
    .join(",");
};

export const formatVND = (amount) => {
  const number = parseFloat(amount);
  if (isNaN(number)) {
    return null;
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};