import { ICanalResponse } from '@/interfaces/canales.interface';
import { BaseApi } from './base/baseServiceApi';
import { IPlayList, IPlayListResponse } from '@/interfaces/playlist.interface';

class PlaylistsService extends BaseApi<IPlayListResponse, IPlayList> {
  constructor() {
    super('/playlists');
  }
}

export const playListService = new PlaylistsService();
