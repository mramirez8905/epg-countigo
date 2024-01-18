import { BaseApi } from './base/baseServiceApi';
import { ILayer, ILayerCollection, ILayerCollectionRequest, ILayerCollectionResponse, ILayerResponse } from '@/interfaces/layer.interface';

class LayersService extends BaseApi<ILayerResponse, ILayer> {
  constructor() {
    super('/layers');
  }
}

class LayersCollectionService extends BaseApi<
  ILayerCollectionResponse,
  ILayerCollectionRequest
> {
  constructor() {
    super('/coleccion-de-layers');
  }
}

export const layersService = new LayersService();
export const layersCollectionService = new LayersCollectionService();

