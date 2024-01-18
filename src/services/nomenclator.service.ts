import {
  INomenclatorGroup,
  INomenclatorGroupResponse,
} from '@/interfaces/nomenclatorGroup.interface';
import { BaseApi } from './base/baseServiceApi';
import { INomenclator, INomenclatorResponse } from '@/interfaces/nomenclador.interface';

class NomenclatorService extends BaseApi<INomenclatorResponse,
  INomenclator
> {
  constructor() {
    super('/nomencladores');
  }
}

export const nomenclatorService = new NomenclatorService();
