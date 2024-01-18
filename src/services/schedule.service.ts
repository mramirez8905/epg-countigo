import { IDeleteMultipleScheduleRequest, IDuplicateScheduleRequest, ISchedule, IScheduleResponse } from '@/interfaces/schedule.interface';
import { BaseApi } from './base/baseServiceApi';
import { axiosInstance } from '@/boot/axios';

class ScheduleService extends BaseApi<IScheduleResponse, ISchedule> {
  constructor() {
    super('/schedules');
  }

  duplicate(body: IDuplicateScheduleRequest) {
    return axiosInstance.post(`schedule/doubleSchedule`, body);
  }
  deleteMultiple(body: IDeleteMultipleScheduleRequest) {
    return axiosInstance.post(`schedule/deleteSeveralSchedule`, body);
  }
}

export const scheduleService = new ScheduleService();
