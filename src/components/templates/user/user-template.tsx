'use client';
import LoretaTable from '@/components/Table/index';
import { CountTVColumnsType } from '@/interfaces/strapiBase.interface';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  deleteUser,
  fetchUsers,
} from '@/store/slices/dashboard/user/userSlice';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Space, Tooltip, notification } from 'antd';
import { useEffect, useState } from 'react';
import { columns } from './columns';
import NewEditUserForm from './new-edit-user-form';

const UserTemplate = () => {
  const loadingUsers = useAppSelector((state) => state.user.loading);
  const users = useAppSelector((state) => state.user.users);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(undefined);

  const columnsActions: CountTVColumnsType<any>[] = [
    ...columns,
    {
      title: 'Acciones',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <Space size='middle'>
          <Tooltip title='Editar'>
            <Button
              size='middle'
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentUser(record);
                setOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title='Eliminar'>
            <Button
              size='middle'
              danger
              icon={<DeleteOutlined />}
              onClick={() => showModal(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const [tableParams, setTableParams] = useState<{ pagination: any }>();

  const handleFetch = (params: any) => {
    dispatch(fetchUsers(params))
      .unwrap()
      .then((result) => {
        // setTableParams((prev) => ({
        //   ...result.meta,
        //   pagination: {
        //     current: result.meta.pagination.page,
        //     pageSize: result.meta.pagination.pageSize,
        //     total: result.meta.pagination.total,
        //   },
        // }));
      });
  };

  const handleTableParamsChange = (params: any) => {
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev?.pagination,
        ...params,
      },
    }));
    handleFetch(params);
  };

  const showModal = (id: number) => {
    const modal = Modal.confirm({
      title: 'Eliminar usuario',
      content: '¿Está seguro que desea eliminar este usuario?',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        handleDelete(id);
        modal.destroy();
      },
      onCancel() {
        modal.destroy();
      },
    });
  };

  const handleDelete = (id: number) => {
    dispatch(deleteUser(id))
      .unwrap()
      .then(() => {
        handleFetch(undefined);
        notification.success({
          message: 'Usuario eliminado',
          description: 'El usuario ha sido eliminado correctamente',
        });
      })
      .catch((err) => {
        notification.error({
          message: 'Error al eliminar',
          description: 'Ha ocurrido un error al eliminar el servidor',
        });
      });
  };

  const handleFiltersChange = (filters: any) => {
    setTableParams((prev) => ({
      ...prev,
      filters,
      pagination: { ...prev?.pagination, current: 1 },
    }));
    const params = {
      ...tableParams,
      pagination: { ...tableParams?.pagination, current: 1 },
      ...filters,
    };
    handleFetch(params);
  };

  useEffect(() => {
    handleFetch(undefined);
  }, []);

  const handleClose = () => {
    setCurrentUser(undefined);
    setOpen(false);
    handleFetch(undefined);
  };

  return (
    <>
      <Card title='Usuarios'>
        <Space
          style={{
            marginTop: '-20px !important',
            marginBottom: 10,
          }}
        >
          <Tooltip title='Agregar'>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => setOpen(true)}
            >
              AGREGAR
            </Button>
          </Tooltip>
        </Space>

        <LoretaTable
          columns={columnsActions}
          data={users}
          loading={loadingUsers}
          onChangeTableParams={handleTableParamsChange}
          onFilterChange={handleFiltersChange}
          tableParams={
            tableParams || { pagination: { current: 1, pageSize: 15 } }
          }
        />
      </Card>

      <NewEditUserForm
        open={open}
        onClose={handleClose}
        currentUser={currentUser}
      />
    </>
  );
};

export default UserTemplate;
