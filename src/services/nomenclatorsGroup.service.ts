import { INomenclatorGroup, INomenclatorGroupResponse } from '@/interfaces/nomenclatorGroup.interface';
import { BaseApi } from './base/baseServiceApi';

class NomenclatorsGroupService extends BaseApi<INomenclatorGroupResponse, INomenclatorGroup> {
  constructor() {
    super('/classes');
  }
}

export const nomenclatorsGroupService = new NomenclatorsGroupService();
