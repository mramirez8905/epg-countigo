'use client';
import { IProgramResponse } from '@/interfaces/program.interface';
import { CountTVColumnsType } from '@/interfaces/strapiBase.interface';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  deletePrograms,
  fetchPrograms,
} from '@/store/slices/dashboard/program/programSlice';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
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
import LoretaTable from '../../Table';
import { columns } from './columns';
import NewEditProgramasForm from './new-edit-programas-form';

const ProgramasTemplate = () => {
  const loading = useAppSelector((state) => state.programs.loading);
  const programs = useAppSelector((state) => state.programs.programs);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<any>(undefined);

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
                setCurrentProgram(record);
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
    dispatch(fetchPrograms(params))
      .unwrap()
      .then((result) => {
        setTableParams((prev) => ({
          ...result.meta,
          pagination: {
            current: result.meta.pagination?.page,
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
      title: 'Eliminar programa',
      content: '¿Está seguro que desea eliminar este programa?',
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
    dispatch(deletePrograms(id))
      .unwrap()
      .then(() => {
        handleFetch(undefined);
        notification.success({
          message: 'Servidor eliminado',
          description: 'El programa ha sido eliminado correctamente',
        });
      })
      .catch((err) => {
        notification.error({
          message: 'Error al eliminar',
          description: 'Ha ocurrido un error al eliminar el programa',
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

  const handleClose = () => {
    setOpen(false);
    setCurrentProgram(undefined);
    handleFetch(undefined);
  };

  useEffect(() => {
    handleFetch(undefined);
  }, []);

  const expandedRowRender = (record: IProgramResponse) => {
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
      <Card title='Programas'>
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
          data={programs}
          loading={loading}
          onChangeTableParams={handleTableParamsChange}
          onFilterChange={handleFiltersChange}
          tableParams={tableParams || { pagination: {} }}
          expandable={{ expandedRowRender }}
        />
      </Card>

      <NewEditProgramasForm
        open={open}
        onClose={handleClose}
        currentProgram={currentProgram}
      />
    </>
  );
};

export default ProgramasTemplate;
