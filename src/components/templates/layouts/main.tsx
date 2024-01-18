import useIcons from '@/components/Icons/icons-hook';
import { paths } from '@/routes/paths';
import { logout } from '@/store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { UserOutlined, VideoCameraOutlined, UploadOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import {
  Layout,
  Menu,
  Row,
  Button,
  Col,
  Dropdown,
  MenuProps,
  theme,
} from 'antd';
import router, { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react'


const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const MainLayoutTemplate = ({children}: {children: ReactNode}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [user, setUser] = useState<IUser>()
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setUser(localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')!))
  }, [])
  

  const icons = useIcons()

  const items: MenuItem[] = [
    {
      label: 'Programación',
      key: 'programacion',
      onClick: () => router.push(paths.epg.programacion),
      icon: icons.dashboard
    },
    {
      label: 'Canales',
      key: 'canales',
      onClick: () => router.push(paths.epg.channels),
      icon: icons.canales
    },
    {
      label: 'Nomencladores',
      key: 'nomencladores',
      icon: icons.nomenclator,
      onClick: () => router.push(paths.epg.nomencladores),
    },
    {
      label: 'Programas',
      key: 'programas',
      onClick: () => router.push(paths.epg.programs),
      icon: icons.programs
    },
    {
      label: 'Usuarios',
      key: 'usuarios',
      onClick: () => router.push(paths.epg.users),
      icon: icons.user_group
    },
  ] 
  return (
    <Layout style={{ minHeight: '98vh' }}>
      <Sider trigger={undefined} collapsible collapsed={collapsed}>
        <div style={{height: '100px'}} />
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={['programacion']}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Row justify={'space-between'}>
            <Button
              type='text'
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Row justify={'end'}>
              <Col style={{ marginRight: 20 }}>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: '1',
                        label: 'Cerrar sesión',
                        onClick: () => {
                          dispatch(logout());
                          router.push('/login');
                        },
                      },
                    ],
                  }}
                  placement='bottomRight'
                  arrow
                >
                  <Button icon={<UserOutlined />}>
                    {(user && user.username) || 'Develop'}
                  </Button>
                </Dropdown>
              </Col>
            </Row>
          </Row>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayoutTemplate