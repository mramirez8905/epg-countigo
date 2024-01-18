import { CountTVColumnsType } from '@/interfaces/strapiBase.interface';

export const columns: CountTVColumnsType<any>[] = [
  {
    title: 'Código',
    dataIndex: 'attributes',
    width: 150,
    key: 'code',
    dataType: 'string',
    render: (attributes) => `${attributes.code}`,
  },
  {
    title: 'Nombre',
    dataIndex: 'attributes',
    width: 150,
    key: 'name',
    dataType: 'string',
    render: (attributes) => `${attributes.name}`,
  },
];
