import { INomenclatorResponse } from '@/interfaces/nomenclador.interface';
import { SelectOption } from '@/types/select.type';

export const transformArrayToObject = (
  arr: INomenclatorResponse[]
): Record<string, SelectOption[]> => {
  return arr.reduce(
    (
      acc: Record<string, SelectOption[]>,
      curr: INomenclatorResponse
    ) => {
      const key = curr.attributes.type;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({value: curr.id, label: curr.attributes.name});
      return acc;
    },
    {}
  );
};
