import { CountTVColumnsType } from '@/interfaces/strapiBase.interface';

export const columns: CountTVColumnsType<any>[] = [
  {
    title: 'Nombre',
    dataIndex: 'nombre',
    dataType: 'string',
    key: 'nombre',
    // render: (attributes) => `${attributes.nombre}`,
    ellipsis: true,
    width: 150,
  },
  {
    title: 'Usuario',
    dataIndex: 'username',
    key: 'username',
    // render: (attributes) => `${attributes.username}`,
    sorter: true,
    ellipsis: true,
    dataType: 'string',
    width: 300,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    // render: (attributes) => `${attributes.email}`,
    sorter: true,
    ellipsis: true,
    dataType: 'string',
    width: 300,
  },
  {
    title: 'Tipo de usuario',
    dataIndex: 'tipoUsuario',
    // render: (attributes) => `${attributes.tipoUsuario}`,
    ellipsis: true,
    dataType: 'string',
    width: 100,
  },
  {
    title: 'Bloqueado',
    dataIndex: 'blocked',
    ellipsis: true,
    width: 100,
    render: (blocked) => {
      return blocked ? 'Si' : 'No';
    },
  },
];
