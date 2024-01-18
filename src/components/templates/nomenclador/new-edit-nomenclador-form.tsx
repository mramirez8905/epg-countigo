'use client';
import { INomenclatorResponse } from '@/interfaces/nomenclador.interface';
import { nomenclatorService } from '@/services/nomenclator.service';
import { SaveFilled } from '@ant-design/icons';
import { Button, Card, Drawer, Form, Input, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect, useState } from 'react';

type FormProps = {
  open: boolean;
  onClose: () => void;
  currentNomenclador?: INomenclatorResponse;
  parent?: {id: string, name: string};
};

const NewEditNomencladorForm = ({
  open,
  onClose,
  currentNomenclador,
  parent,
}: FormProps) => {
  const isEditMode = !!currentNomenclador;


  const [form] = useForm();

  const handleFinish = async (values: any) => {
    if (isEditMode) {
      nomenclatorService
        .put(currentNomenclador.id, { ...values, type: parent?.id })
        .then(() => {
          notification.success({
            message: 'Nomenclador actualizado con éxito',
          });
          form.resetFields()
          onClose();
        })
        .catch(({response}) => {
          notification.error({
            message:
              response.data.error.message ||
              'Error al actualizar el nomenclador',
          });
        });
    } else {
      nomenclatorService
        .post({ ...values, type: parent?.id })
        .then(() => {
          notification.success({ message: 'Nomenclador creado con éxito' });
          form.resetFields();
          onClose();
        })
        .catch(({response}) => {
          notification.error({
            message: response.data.error.message || 'Error al crear el nomenclador',
          });
        });
    }
  };

  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue({
      code: currentNomenclador?.attributes.code || '',
      name: currentNomenclador?.attributes.name || '',
    })
  }, [currentNomenclador])
  

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      size='large'
      title={isEditMode ? 'EDITAR NOMENCLADOR' : 'AGREGAR NOMENCLADOR'}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 12,
        }}
      >
        <Card
          title={parent?.name}
          actions={[
            <Button
              key={'atcBtnNm'}
              type='primary'
              htmlType='submit'
              size='large'
            >
              <SaveFilled style={{ fontSize: 25 }} />
              <span style={{ fontSize: 18 }}>Guardar</span>
            </Button>,
          ]}
        >
          <Form.Item
            label='Código'
            name='code'
            rules={[
              {
                required: true,
                message: 'Ingrese el código del nomenclador',
              },
            ]}
          >
            <Input placeholder='Código' />
          </Form.Item>
          <Form.Item
            label='Nombre'
            name='name'
            rules={[
              {
                required: true,
                message: 'Ingrese el nombre del nomenclador',
              },
            ]}
          >
            <Input placeholder='Nombre' />
          </Form.Item>
        </Card>
      </Form>
    </Drawer>
  );
};

export default NewEditNomencladorForm;
