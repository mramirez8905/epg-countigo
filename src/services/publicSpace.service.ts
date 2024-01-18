import { IPublicSpace, IPublicSpaceResponse } from '@/interfaces/publicSpace.interface';
import { BaseApi } from './base/baseServiceApi';

class PublicSpaceService extends BaseApi<IPublicSpaceResponse, IPublicSpace> {
  constructor() {
    super('/espacios-publicitarios');
  }
}

export const publicSpaceService = new PublicSpaceService();
