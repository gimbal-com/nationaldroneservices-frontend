"use client";

import React, { ReactNode } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import { jwtDecode } from 'jwt-decode';

import { loadToken } from '@/store/features/auth/authSlice';
import { setAuthToken } from '@/lib/axios';

const StoreProvider = ({ children }: { children: ReactNode }) => {  // Define the StoreProvider component that accepts 'children' as a prop of type ReactNode

    const dispatch = useDispatch<AppDispatch>();  // Get the dispatch function with proper typing (AppDispatch) for dispatching Redux actions

    useEffect(() => {  // useEffect hook runs side-effects, in this case, loading the token when the component mounts

        const token = window.localStorage.getItem('token') || '';  // Retrieve the token from localStorage, defaulting to an empty string if not found

        if (token) {  // If a token exists in localStorage
            // Decode the JWT token and extract relevant user information
            let user = jwtDecode<{ username: string; email: string; accountType: string, id: number }>(token);

            // Dispatch the loadToken action to store the user data (id, username, email, accountType) in the Redux state
            dispatch(loadToken({ id: user.id, username: user.username, email: user.email, accountType: user.accountType }));
        }
    }, [dispatch]);  // Dependency array: re-run the effect only when 'dispatch' changes (which should be stable in most cases)

    return (
        <>{children}</>  // Render the children components wrapped by StoreProvider
    );
};

export default StoreProvider;