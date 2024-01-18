import React from 'react'
import { ConfigProvider as ConfigProviderAntd } from 'antd'
import locale from 'antd/locale/es_ES';

const ConfigProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <ConfigProviderAntd
      locale={locale}
      theme={{
        token: {
          colorPrimary: '#021761',
          colorInfo: '#021761',
          colorSuccess: '#99cccc',
        },
      }}
    >{children}</ConfigProviderAntd>
  );
}

export default ConfigProvider