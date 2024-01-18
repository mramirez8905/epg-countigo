import { ICanal, ICanalResponse } from '@/interfaces/canales.interface';
import { BaseApi } from './base/baseServiceApi';
import { IChannel, IChannelResponse } from '@/interfaces/channel.interface';

class ChannelsService extends BaseApi<IChannelResponse, IChannel> {
  constructor() {
    super("/channels");
  }
}

export const canalesService = new ChannelsService();
