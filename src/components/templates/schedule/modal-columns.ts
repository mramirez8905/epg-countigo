import { ISchedule, IScheduleResponse } from '@/interfaces/schedule.interface';
import { CountTVColumnsType } from '@/interfaces/strapiBase.interface';
import { convertToHHMMSS } from '@/utils/timeUtils';
import dayjs from 'dayjs';

export const columns: CountTVColumnsType<any>[] = [
  {
    title: 'Nombre',
    dataIndex: 'attributes',
    width: 150,
    key: 'title',
    dataType: 'string',
    render: (attributes: ISchedule) => `${attributes.title}`,
    onFilter: (value: any, record: any) => record.name.indexOf(value) === 0,
  },
  {
    title: 'Fecha de publicación',
    dataIndex: 'attributes',
    width: 150,
    key: 'videopublishdate',
    dataType: 'date',
    render: (attributes: ISchedule) =>
      `${dayjs(attributes.videopublishdate).format('DD/MM/YYYY HH:mm:ss')}`,
  },
  {
    title: 'Duración',
    dataIndex: 'attributes',
    width: 150,
    key: 'duration',
    dataType: 'number',
    render: (attributes: ISchedule) =>
      `${convertToHHMMSS(+attributes.duration)}`,
  },
]; 