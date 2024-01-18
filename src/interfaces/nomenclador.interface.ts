import { NomenclatorEnum } from '@/types/nomencladores';

export interface INomenclator {
  code: string;
  name: string;
  type: NomenclatorEnum;
  output: any;
  schedule: any;
  program: any;
  channel: any;
  locale: string;
}

export interface INomenclatorResponse {
  id: number;
  attributes: INomenclator;
}