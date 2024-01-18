'use client'
import { axiosInstance } from '@/boot/axios';
import { login } from '@/store/auth/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { Form, Input, Button, Flex, Card, notification } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

type FieldType = {
  identifier?: string;
  password?: string;
};

const LoginTemplate = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/auth/local', {
        identifier: values.identifier,
        password: values.password,
      });
      localStorage.setItem('token', response.data.jwt);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      dispatch(login(response.data.user));
      setLoading(false);
      router.push('/');
    } catch (error) {
      setLoading(false);
      notification.error({
        message: 'Error',
        description: 'Usuario o contraseña incorrectos',
      });  
    }
  };

  return (
    <Flex align='center' justify='center' style={{ minHeight: '97vh'}}>
      <Card title='Iniciar sesión' style={{ width: 600 }}>
      <Form
        name='basic'
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item<FieldType>
          label='Usuario'
          name='identifier'
          rules={[{ required: true, message: 'Ingrese el usuario!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label='Contraseña'
          name='password'
          rules={[{ required: true, message: 'Ingrese la contraseña!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit' loading={loading}>
            Ingresar
          </Button>
        </Form.Item>
      </Form>
      </Card>

    </Flex>
  );
}

export default LoginTemplate