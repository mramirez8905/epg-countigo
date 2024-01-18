import { INomenclatorResponse } from './nomenclador.interface';

export interface IProgram {
  duration: number;
  title: string;
  description: string;
  thumbnail: string;
  keywords: string;
  active: boolean;
  approved: boolean;
  titleInternal: string;
  programId: string;
  videoPublishDate: Date;
  // content_format_id: { data: INomenclatorResponse };
  // content_type_id: { data: INomenclatorResponse };
  // language_id: { data: INomenclatorResponse };
  // country_id: { data: INomenclatorResponse };
  // parental_rating_id: { data: INomenclatorResponse };
  // series_id_id: { data: INomenclatorResponse };
  // program_type_id: { data: INomenclatorResponse };
  // video_id_id: { data: INomenclatorResponse };
  // video_id_partner_id: { data: INomenclatorResponse };
  // genre_id_id: { data: INomenclatorResponse };
  // subGenre_id: { data: INomenclatorResponse };
  channel_id: { data: INomenclatorResponse };
  nomencladors: {data: INomenclatorResponse[]};
}

export interface IProgramResponse {
  id: number;
  attributes: IProgram;
}
