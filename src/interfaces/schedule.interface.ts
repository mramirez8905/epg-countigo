import { IChannel } from "./channel.interface";
import { INomenclator, INomenclatorResponse } from "./nomenclador.interface";

export interface ISchedule {
  start: string;
  end: string;
  duration: string;
  title: string;
  description: string;
  titleinternal: string;
  season: number;
  episode: number;
  adBreakPositions: string;
  more: string;
  videopublishdate: string;
  approved: boolean;
  externalMetadataId: string;
  exported: boolean;
  program: any;
  programid: string;
  parentalrating: string;
  programtype: string;
  videoid: string;
  videoidpartner: string;
  thumbnail: string;
  genre: string;
  subgenre: string;
  keywords: string;
  ratingage: number;
  country: string;
  countryName: string;
  language: string;
  languageName: string;
  seriesId: string;
  series: string;
  contenttype: string;
  contentformat: string;
  channelprovider: string;
  channel: IChannel;
}

export interface IScheduleResponse {
  id: number;
  attributes: ISchedule;
}

export interface IDuplicateScheduleRequest {
  start_d: Date
  end_d: Date
  start_o: Date
  end_o: Date
}

export interface IDeleteMultipleScheduleRequest {
  listIdShedules: number[];
}
