'use client' // Marks this as a client component in Next.js

import Image from 'next/image';
import { ReactNode } from 'react';
import { LogOutIcon } from 'lucide-react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { UserData } from '@/store/features/auth/authSlice';
import { Button } from '@/components/ui/button';

// Define the MainLayout component, accepting children as a prop
const MainLayout = ({ children }: { children: ReactNode }) => {
    
    // Retrieve user data from Redux store
    const user = useSelector<RootState>(store => store.auth.user) as UserData;

    return (
        <div className='flex h-screen w-full'> {/* Main layout container */}
            
            {/* Sidebar */}
            <div className='w-80 bg-slate-600 flex flex-col p-4 gap-4 h-screen'>
                
                {/* Logo */}
                <div>
                    <Image src={'/images/logo.png'} width={300} height={120} alt='Logo' />
                </div>

                {/* Divider */}
                <div className='border-b' />

                {/* User Profile Section */}
                <div className='flex gap-2 items-center'>
                    <Avatar>
                        <AvatarImage src={'/images/avatar-default.jpg'} width={50} height={50} alt='Avatar' />
                    </Avatar>
                    <div className='flex flex-col'>
                        {/* Display username and email */}
                        <span className='text-white text-sm font-semibold'>{user?.username}</span>
                        <span className='text-white text-xs'>{user?.email}</span>
                    </div>
                    
                    {/* Spacer to push the logout button to the right */}
                    <div className='flex-1' />
                    
                    {/* Logout Button */}
                    <div className=''>
                        <Button size={'icon'} variant={'default'}>
                            <LogOutIcon />
                        </Button>
                    </div>
                </div>

                {/* Divider */}
                <div className='border-b' />

                {/* Sidebar Buttons (Placeholder) */}
                <Button>Dammy Button 1</Button>
                <Button>Dammy Button 2</Button>
                <Button>Dammy Button 3</Button>
            </div>

            {/* Main Content Area */}
            <div className='flex-1 h-screen overflow-auto'>
                {children} {/* Renders child components inside the main content area */}
            </div>

        </div>
    )
}

export default MainLayout;
