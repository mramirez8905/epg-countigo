import { axiosInstance } from '@/boot/axios';
import { BaseApi } from './base/baseServiceApi';
import { IChannel, IChannelResponse } from '@/interfaces/channel.interface';

class ChannelService extends BaseApi<IChannelResponse, IChannel> {
  constructor() {
    super("/channels");
  }
  putChannel(id: number, body: any) {
    return axiosInstance.put<any>(`${this.url}/${id}`, body);
  }
  postChannel(body: IChannel) {
    return axiosInstance.post<IChannel>(`${this.url}`, body);
  }
}

export const channelsService = new ChannelService();