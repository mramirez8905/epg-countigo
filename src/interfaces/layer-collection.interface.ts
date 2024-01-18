import { ILayerResponse } from './layer.interface';

interface ILayerCollection {
  orden: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  layer: {
    data: ILayerResponse;
  };
}

export interface ILayerCollectionResponse {
  id: number;
  attributes: ILayerCollection;
}