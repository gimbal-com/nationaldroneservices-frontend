'use client';

import { FC } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';

import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { login } from '@/store/features/auth/authSlice';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    username: z.string().min(1, { message: 'Username is required.' }),
    password: z.string().min(1, { message: 'Password is required.' })
})

const LoginPage: FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    })

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const response = await dispatch(login(values));
        
        if (login.fulfilled.match(response)) {
            router.push('/job');
        }
    }

    return (
        <Card className='w-96'>
            <CardHeader>
                <CardTitle className='text-center mb-4'>
                    <h2 className='text-xl'>
                        Login
                    </h2>
                </CardTitle>
                <Image src={'/images/logo.png'} width={400} height={200} alt='Logo' />
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-2'>
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Username' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Password' type='password' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' className='w-full my-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                            Login
                        </Button>
                    </form>
                </Form>
                <p className='text-sm my-3'>
                    Don't you have an account?
                    <Link href={'/auth/register'} className='text-blue-600 hover:underline ml-2'>Create One</Link>
                </p>
            </CardContent>
        </Card>
    )
}

export default LoginPage;