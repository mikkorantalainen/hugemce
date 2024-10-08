import { Arr } from '@hugemce/katamari';

/**
 * Slice an array at the first item matched by the predicate
 */
const sliceby = <T>(list: T[], pred: (x: T, i: number) => boolean): T[] => {
  const index = Arr.findIndex(list, pred).getOr(-1);
  return list.slice(0, index);
};

export {
  sliceby
};
