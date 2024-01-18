'use client';
import { SaveFilled, SaveOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Drawer,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Switch,
  notification,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect } from 'react';
import { USERTYPE } from './constant/userType';
import { usersService } from '@/services/user.service';

type NewEditUserFormProps = {
  open: boolean;
  onClose: () => void;
  currentUser?: IUser;
};

const NewEditUserForm = ({
  currentUser,
  open,
  onClose,
}: NewEditUserFormProps) => {
  const isEditMode = !!currentUser;
  const [form] = useForm();

  const handleFinish = async (values: any) => {
    delete values.confirm;
    values.role = 1;
    values.superUsuario=false;
    if (isEditMode) {
      usersService
        .putUser(currentUser.id, values)
        .then(() => {
          notification.success({
            message: 'Usuario actualizado con éxito',
          });
          form.resetFields();
          onClose();
        })
        .catch(({ response }) => {
          notification.error({
            message:
              response.data.error.message || 'Error al actualizar el usuario',
          });
        });
    } else {
      usersService
        .postUser({...values, activo: true, confirmed: true})
        .then(() => {
          notification.success({
            message: 'Usuario creado con éxito',
          });
          form.resetFields();
          onClose();
        })
        .catch(({ response }) => {
          notification.error({
            message: response.data.error.message || 'Error al crear el usuario',
          });
        });
    }
  };

  useEffect(() => {
    form.setFields([
      {
        name: 'email',
        value: currentUser?.email || '',
      },
      {
        name: 'username',
        value: currentUser?.username || '',
      },
      {
        name: 'blocked',
        value: currentUser?.blocked || false,
      },
      {
        name: 'tipoUsuario',
        value: currentUser?.tipoUsuario || '',
      },
      {
        name: 'activo',
        value: currentUser?.activo || true,
      },
      {
        name: 'nombre',
        value: currentUser?.nombre || '',
      },
    ]);
  }, [currentUser]);

  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      size='large'
      title={isEditMode ? 'EDITAR USUARIO' : 'AGREGAR USUARIO'}
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
          actions={[
            <Button
            key={'actBtnUsr'}
              type='primary'
              htmlType='submit'
              size='large'
              // loading={loading}
              // disabled={loading}
            >
              <SaveOutlined style={{ fontSize: 25 }} />
              <span style={{ fontSize: 18 }}>Guardar</span>
            </Button>,
          ]}
        >
          <Form.Item label='Nombre' name='nombre'>
            <Input placeholder='Nombre del usuario' />
          </Form.Item>
          <Form.Item
            label='Usuario'
            name='username'
            rules={[
              {
                required: true,
                message: 'Ingrese el usuario',
              },
            ]}
          >
            <Input placeholder='Usuario' />
          </Form.Item>
          <Form.Item
            label='Correo'
            name='email'
            rules={[
              {
                required: true,
                message: 'Ingrese el correo',
              },
            ]}
          >
            <Input placeholder='Usuario' type='email' />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Seleccione el tipo de usuario',
              },
            ]}
            label='Tipo de usuario'
            name='tipoUsuario'
          >
            <Select options={USERTYPE} />
          </Form.Item>
          {currentUser && (
            <Form.Item label='Activo' name='activo'>
              <Switch />
            </Form.Item>
          )}
          <Form.Item label='Bloqueado' name='blocked'>
            <Switch />
          </Form.Item>

          <Form.Item
            name='password'
            label='Contraseña'
            rules={[
              {
                required: !currentUser,
                message: 'Introduzca la contraseña',
              },
              {
                min: 6,
                message: 'La contraseña debe tener al menos 6 caracteres',
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder={currentUser && '••••••••'} />
          </Form.Item>

          <Form.Item
            name='confirm'
            label='Confirmar Contraseña'
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: !currentUser,
                message: 'Confirme su contraseña',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Las contraseñas no coinciden')
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder={currentUser && '••••••••'} />
          </Form.Item>

          {/* <Row justify={'center'}>
            <Col span={8}> 
            
            </Col>
            <Col span={7}> 
            
            </Col>
          </Row> */}
        </Card>
      </Form>
    </Drawer>
  );
};

export default NewEditUserForm;
