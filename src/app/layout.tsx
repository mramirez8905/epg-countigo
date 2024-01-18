import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'
import { App } from 'antd';
import ReduxProvider from '@/store/provider';
import AuthProvider from '@/providers/auth';
import ConfigProvider from '@/providers/configProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Guía de TV',
  description: 'Guía de TV',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es'>
      <body className={inter.className}>
          <App>
            <ConfigProvider>
              <ReduxProvider>
                <AuthProvider>{children}</AuthProvider>
              </ReduxProvider>
            </ConfigProvider>
          </App>
      </body>
    </html>
  );
}
