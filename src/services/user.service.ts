import { axiosInstance } from '@/boot/axios';
import { BaseApi } from './base/baseServiceApi';
import { convertParams } from '@/components/Table/utils';

class UsersService extends BaseApi<IUser, IUser> {
  constructor() {
    super('/users');
  }
  getUsers(params?: any) {
    const convertedParams = params ? convertParams(params) : undefined;
    return axiosInstance.get<IUser[]>(this.url, {
      params: {
        populate: '*',
        sort: [{ createdAt: 'desc' }],
        ...convertedParams,
      },
    });
  }
  putUser(id: number, body: IUser) {
    return axiosInstance.put<IUser>(`${this.url}/${id}`, body);
  }
  postUser(body: IUser) {
    return axiosInstance.post<IUser>(`${this.url}`, body);
  }
  userInfo () {
    return axiosInstance.get<IUser>(`${this.url}/me`);
  }
}

export const usersService = new UsersService();
