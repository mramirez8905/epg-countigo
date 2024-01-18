'use client';
import LoretaTable from '@/components/Table';
import { IScheduleResponse } from '@/interfaces/schedule.interface';
import { scheduleService } from '@/services/schedule.service';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Input, Modal, Row, Table, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { columns } from './modal-columns';
import { DatePicker } from 'antd/lib';
import dayjs, { Dayjs } from 'dayjs';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const params = {
  _limit: -1,
};

const DeleteScheduleModal = ({ open, setOpen }: Props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<Dayjs>();
  const [filteredData, setFilteredData] = useState<IScheduleResponse[]>([]);

  const [schedules, setSchedules] = useState<IScheduleResponse[]>([]);

  const fetchSchedules = async () => {
    try {
      const response = await scheduleService.get(params);
      setSchedules(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    open ? fetchSchedules() : setSchedules([]);
  }, [open]);

  const handleDelete = async () => {
    try {
      if (selectedRowKeys.length > 0) {
        await scheduleService.deleteMultiple({
          listIdShedules: selectedRowKeys as number[],
        });
        notification.success({
          message: 'Eliminación correcta',
        });
        setOpen(false);
      } else {
        notification.error({
          message: 'Debe seleccionar al menos una programación para eliminar',
        });
      }
    } catch (error) {}
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleSearch = () => {
    const filteredData = schedules.filter((schedule) => {
      const titleMatch = title
        ? schedule.attributes.title.toLowerCase().includes(title.toLowerCase())
        : true;
      const dateMatch = date
        ? dayjs(schedule.attributes.videopublishdate).format('YYYY-MM-DD') ===
          dayjs(date).format('YYYY-MM-DD')
        : true;
      return titleMatch && dateMatch;
    });
    setFilteredData(filteredData);
  };

  const clearFilters = () => {
    setTitle('');
    setDate(undefined);
    setFilteredData(schedules);
  };

  return (
    <Modal
      open={open}
      okText='ELIMINAR'
      cancelText='CANCELAR'
      okButtonProps={{ danger: true, icon: <DeleteOutlined /> }}
      onCancel={() => setOpen(false)}
      onOk={() => {
        handleDelete();
      }}
      title={'ELIMINAR PROGRAMACIONES'}
      style={{ minWidth: 800 }}
    >
      <div style={{ padding: 8 }}>
        <div style={{ display: 'block' }}>
          <Input
            placeholder={`Buscar título`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: 188, marginBottom: 8, marginRight: 8 }}
          />
          <DatePicker
            placeholder={`Buscar fecha`}
            value={date}
            onChange={(e: any) => setDate(e)}
            style={{ width: 188, marginBottom: 8 }}
          />
        </div>
        <Button
          type='primary'
          onClick={() => handleSearch()}
          size='small'
          style={{ width: 90, marginRight: 8 }}
        >
          BUSCAR
        </Button>
        <Button
          onClick={() => clearFilters()}
          size='small'
          style={{ width: 90 }}
        >
          LIMPIAR
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData.map((schedule) => ({
          ...schedule,
          key: schedule.id,
        }))}
        rowSelection={rowSelection}
        scroll={{ y: 800, x: 0 }}
        pagination={false}
      />
    </Modal>
  );
};

export default DeleteScheduleModal;
