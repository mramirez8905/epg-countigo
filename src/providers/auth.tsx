'use client'
import { paths } from '@/routes/paths';
import { usersService } from '@/services/user.service'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/auth/authSlice';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState<boolean>(false);
const dispatch = useAppDispatch();

  useEffect(() => {
    // handleUser();
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      const now = new Date().getTime() / 1000;
      if (now > decoded.exp) {
        router.replace(paths.login.root);
      }
    }
  }, []);

  return <>{children}</>;
};

export default AuthProvider