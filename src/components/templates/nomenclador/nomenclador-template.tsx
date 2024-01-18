'use client';
import { INomenclatorResponse } from '@/interfaces/nomenclador.interface';
import { CountTVColumnsType } from '@/interfaces/strapiBase.interface';
import { nomenclatorService } from '@/services/nomenclator.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNomenclators } from '@/store/slices/dashboard/nomenclators/nomenclatorsSlice';
import { SelectOption } from '@/types/select.type';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Modal,
  Select,
  Space,
  Tooltip,
  notification,
} from 'antd';
import { useState } from 'react';
import { nomencladoresType } from '../../../types/nomencladores';
import LoretaTable from '../../Table';
import { columns } from './columns';
import NewEditNomencladorForm from './new-edit-nomenclador-form';
import { filterOption } from '@/utils/filter-search';

const NomencladorTemplate = () => {
  const loading = useAppSelector((state) => state.nomenclator.loading);
  const nomenclators = useAppSelector(
    (state) => state.nomenclator.nomenclators
  );
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [currentNomenclador, setCurrentNomenclator] =
    useState<INomenclatorResponse | undefined>(undefined);
  const [selectedParent, setSelectedParent] = useState<{
    id: string;
    name: string;
  }>();
  const [groups, setGroups] = useState<SelectOption[]>([]);

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
                setCurrentNomenclator(record);
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
    dispatch(fetchNomenclators(params))
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
      },
    }));
    const tempParams: any = {
      ...tableParams,
      pagination: {
        ...tableParams?.pagination,
      },
      filters: {
        type: {
          $eq: selectedParent?.id,
        },
      },
    };

    handleFetch(tempParams);
  };

  const showModal = (id: number) => {
    const modal = Modal.confirm({
      title: 'Eliminar nomenclador',
      content: '¿Está seguro que desea eliminar este nomenclador?',
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
    nomenclatorService.delete(id).then((result: any) => {
      notification.success({
        message: 'Nomenclador eliminado',
        description: 'El nomenclador ha sido eliminado correctamente',
      });
      handleFetch({
        filters: {
          type: {
            $eq: result.data.data.attributes.type,
          },
        },
      });
    }).catch(({response} : {response: any}) => {
      notification.error({
        message: response.data.error.message || 'Error al eliminar el nomenclador',
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
      filters: {
        $and: [
          { ...filters },
          {
            type: {
              $eq: selectedParent?.id,
            },
          },
        ],
      },
    };
    handleFetch(params);
  };

  const handleClose = () => {
    setCurrentNomenclator(undefined);
    setOpen(false);
    handleFetch({
      filters: {
        type: {
          $eq: selectedParent?.id,
        },
      },
    });
  };

  const handleAdd = () => {
    if (selectedParent) {
      setOpen(true);
    } else {
      notification.error({
        message: 'Error al agregar',
        description: 'Debe seleccionar una categoría padre',
      });
    }
  };

  return (
    <>
      <Card title='Nomencladores'>
        <Space
          style={{
            marginTop: '-20px !important',
            marginBottom: 10,
            minWidth: 300,
          }}
        >
          <Tooltip title='Agregar'>
            <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd} >AGREGAR</Button>
          </Tooltip>
          <Select
            showSearch
            options={nomencladoresType}
            placeholder='Nomenclador'
            style={{ marginLeft: 20, minWidth: 250 }}
            filterOption={filterOption}
            size='large'
            value={selectedParent?.id}
            onChange={(value: any, option: any) => {
              setSelectedParent({ id: value, name: option.label });
              handleFetch({
                filters: {
                  type: {
                    $eq: value,
                  },
                },
              });
            }}
          />
        </Space>

        <LoretaTable
          columns={columnsActions}
          data={nomenclators}
          loading={loading}
          onChangeTableParams={handleTableParamsChange}
          onFilterChange={handleFiltersChange}
          tableParams={tableParams || { pagination: {} }}
        />
      </Card>

      <NewEditNomencladorForm
        open={open}
        onClose={handleClose}
        currentNomenclador={currentNomenclador || undefined}
        parent={selectedParent}
      />
    </>
  );
};

export default NomencladorTemplate;
