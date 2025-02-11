"use client";

import React, { ReactNode } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import { jwtDecode } from 'jwt-decode';

import { loadToken } from '@/store/features/auth/authSlice';
import { setAuthToken } from '@/lib/axios';

const StoreProvider = ({ children }: { children: ReactNode }) => {

    const dispatch = useDispatch<AppDispatch>();

    
    useEffect(() => {
        const token = window.localStorage.getItem('token') || '';
        // setAuthToken(window.localStorage.getItem('token'));
        if (token) {
            let user = jwtDecode<{ username: string; email: string; accountType: string, id: number }>(token);

            dispatch(loadToken({ id: user.id, username: user.username, email: user.email, accountType: user.accountType }));
        }
    }, [dispatch]);

    return (
        <>{children}</>
    );
};

export default StoreProvider;