import { INomenclatorResponse } from "./nomenclador.interface";

export interface IChannelResponse {
  id: number;
  attributes: IChannel;
}
export interface IRelatedField {
  id: number;
  attributes: {
    code: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}
export interface IChannel {
  name: string;
  description: string;
  active: boolean;
  created: string;
  provider: string;
  thumbnail: string;
  genre: string;
  subGenre: string;
  timezoneName: string;
  timezone: string;
  country: string;
  parentalRating: string;
  resolution: string;
  width: number;
  height: number;
  tracker: string;
  epg_from: string | undefined;
  epg_to: string | undefined;
  epg_url: string | undefined;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  scheduleLastUpdated: string;
  unique_id: string | undefined;
  canal: {
    data: INomenclatorResponse[];
  };
  nomencladors: { data: INomenclatorResponse[] };
}
