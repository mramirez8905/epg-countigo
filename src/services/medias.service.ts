import { IMedias, IMediasResponse } from '@/interfaces/medias.interface';
import { BaseApi } from './base/baseServiceApi';

class MediasService extends BaseApi<IMediasResponse, IMedias> {
  constructor() {
    super('/medias');
  }
}

export const mediasService = new MediasService();
