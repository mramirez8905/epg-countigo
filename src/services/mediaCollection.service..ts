import { IMediasCollection, IMediasCollectionResponse } from '@/interfaces/medias.interface';
import { BaseApi } from './base/baseServiceApi';

class MediasCollectionService extends BaseApi<IMediasCollectionResponse, IMediasCollection> {
  constructor() {
    super('/coleccion-de-medias');
  }
}

export const mediasCollectionService = new MediasCollectionService();
