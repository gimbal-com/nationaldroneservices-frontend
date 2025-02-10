"use client";

import React, { ReactNode, FC } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import { jwtDecode } from 'jwt-decode';

import { loadToken } from '@/store/features/auth/authSlice';

const StoreProvider = ({ children }: { children: ReactNode }) => {

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const token = localStorage.getItem('token') || '';
        if (token) {
            let user = jwtDecode<{ username: string; email: string; accountType: string }>(token);

            dispatch(loadToken({ username: user.username, email: user.email, accountType: user.accountType, token }));
        }
    }, [dispatch]);

    return (
        <>{children}</>
    );
};

export default StoreProvider;