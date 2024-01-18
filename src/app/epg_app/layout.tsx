'use client'
import MainLayoutTemplate from '@/components/templates/layouts/main';
import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <MainLayoutTemplate >
      {children}
    </MainLayoutTemplate>
  );
}

export default MainLayout