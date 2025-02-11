'use client'

import Image from 'next/image';
import { ReactNode } from 'react';
import { LogOutIcon } from 'lucide-react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { UserData } from '@/store/features/auth/authSlice';
import { Button } from '@/components/ui/button';

const MainLayout = ({ children }: { children: ReactNode }) => {
    const user = useSelector<RootState>(store => store.auth.user) as UserData;

    return (
        <div className='flex h-screen w-full'>
            <div className='w-80 bg-slate-600 flex flex-col p-4 gap-4 h-screen'>
                <div>
                    <Image src={'/images/logo.png'} width={300} height={120} alt='Logo' />
                </div>
                <div className='border-b' />
                <div className='flex gap-2 items-center'>
                    <Avatar>
                        <AvatarImage src={'/images/avatar-default.jpg'} width={50} height={50} alt='Avatar' />
                    </Avatar>
                    <div className='flex flex-col'>
                        <span className='text-white text-sm font-semibold'>{user?.username}</span>
                        <span className='text-white text-xs'>{user?.email}</span>
                    </div>
                    <div className='flex-1' />
                    <div className=''>
                        <Button size={'icon'} variant={'default'}>
                            <LogOutIcon />
                        </Button>
                    </div>
                </div>
                <div className='border-b' />
                <Button>Dammy Button 1</Button>
                <Button>Dammy Button 2</Button>
                <Button>Dammy Button 3</Button>
            </div>
            <div className='flex-1 h-screen overflow-auto'>
                {children}
            </div>
        </div>
    )
}

export default MainLayout;