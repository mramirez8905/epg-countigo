import { IProgram } from '@/interfaces/program.interface';
import { CountTVColumnsType } from '@/interfaces/strapiBase.interface';
import { convertToHHMMSS } from '@/utils/timeUtils';
import moment from 'moment';

export const columns: CountTVColumnsType<any>[] = [
  {
    title: 'Título',
    dataIndex: 'attributes',
    key: 'title',
    dataType: 'string',
    render: (attributes) => `${attributes.title}`,
    ellipsis: true,
  },
  {
    title: 'Activo',
    dataIndex: 'attributes',
    key: 'active',
    width: 100,
    render: (attributes) => {
      return attributes.active ? 'Si' : 'No';
    },
    ellipsis: true,
    dataType: 'string',
  },
  {
    title: 'Canal',
    dataIndex: 'attributes',
    key: 'channel_id.name',
    render: (attributes) =>
      `${attributes.name || ''}`,
    dataType: 'string',
  },
  {
    title: 'Duración',
    dataIndex: 'attributes',
    key: 'duration',
    render: (attributes) => {
      return `${convertToHHMMSS(+attributes.duration)}`;
    },
    dataType: 'number',
  },
  {
    title: 'Fecha de publicación',
    dataIndex: 'attributes',
    key: 'videoPublishDate',
    render: (attributes) => {
      return `${moment(attributes.videoPublishDate).format('DD/MM/YYYY')}`;
    },
    dataType: 'number',
  },
];
