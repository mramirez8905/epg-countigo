/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import LoretaTable from '@/components/Table';
import { CountTVColumnsType } from '@/interfaces/strapiBase.interface';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteCanales } from '@/store/slices/dashboard/canales/sliceCanales';
import { fetchChannel } from '@/store/slices/dashboard/channels/channelsSlice';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  PlusSquareFilled,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Descriptions,
  Modal,
  Space,
  Tooltip,
  notification,
} from 'antd';
import { useEffect, useState } from 'react';
import { columns } from './columns';
import NewEditCanalForm from './new-edit-canal-form';
import { IChannelResponse } from '@/interfaces/channel.interface';

function CanalTemplate() {
  const loadingCanales = useAppSelector((state) => state.canales.loading);
  const channels = useAppSelector((state) => state.channels.channels);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [currentCanal, setCurrentCanal] = useState<any>(undefined);

  const columnsActions: CountTVColumnsType<any>[] = [
    ...columns,
    {
      title: 'Acciones',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_text, record) => (
        <Space size='middle'>
          <Tooltip title='Editar'>
            <Button
              size='middle'
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentCanal(record);
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
    dispatch(fetchChannel(params))
      .unwrap()
      .then((result) => {
        setTableParams((prev) => ({
          ...result.meta,
          pagination: {
            current: result.meta.pagination?.page ?? 1,
            pageSize: result.meta.pagination?.pageSize,
            total: result.meta.pagination?.total,
          },
        }));
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
      title: 'Eliminar canal',
      content: `¿Está seguro que desea eliminar el canal?`,
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
    dispatch(deleteCanales(id))
      .unwrap()
      .then(() => {
        handleFetch(undefined);
        notification.success({
          message: 'Canal eliminado',
          description: `El canal ha sido eliminado correctamente`,
        });
      })
      .catch((err) => {
        notification.error({
          message: 'Error al eliminar',
          description: 'Ha ocurrido un error al eliminar el canal',
        });
      });
  };

  const handleFiltersChange = ({ filters }: any) => {
    setTableParams((prev) => ({
      ...prev,
      filters,
      pagination: { ...prev?.pagination, current: 1 },
    }));
    const params = {
      ...tableParams,
      pagination: { ...tableParams?.pagination, current: 1 },
      filters,
    };
    handleFetch(params);
  };

  const handleClose = () => {
    setCurrentCanal(undefined);
    setOpen(false);
    handleFetch(undefined);
  };
  useEffect(() => {
    handleFetch(undefined);
  }, []);
  const expandedRowRender = (record: IChannelResponse) => {
    return (
      <Descriptions title='Información adicional'>
        {record.attributes.nomencladors.data.map((item) => (
          <Descriptions.Item key={item.id} label={item.attributes.type}>
            {item.attributes.name || '-'}
          </Descriptions.Item>
        ))}
      </Descriptions>
    );
  };

  return (
    <>
      <Card title='Canales'>
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
          data={channels}
          loading={loadingCanales}
          onChangeTableParams={handleTableParamsChange}
          onFilterChange={handleFiltersChange}
          tableParams={tableParams || { pagination: {} }}
          expandable={{ expandedRowRender }}
        />
      </Card>

      <NewEditCanalForm
        open={open}
        onClose={handleClose}
        currentCanal={currentCanal}
      />
    </>
  );
}

export default CanalTemplate;
