'use client'; // Ensures this component is a client component in Next.js

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

// Define validation schema using Zod
const formSchema = z.object({
    username: z.string().min(1, { message: 'Username is required.' }), // Username must not be empty
    password: z.string().min(1, { message: 'Password is required.' }) // Password must not be empty
})

const LoginPage: FC = () => {
    
    const dispatch = useDispatch<AppDispatch>(); // Redux dispatch for handling login
    const router = useRouter(); // Next.js router for navigation

    // Initialize the form with validation rules and default values
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), // Apply Zod validation resolver
        defaultValues: {
            username: '',
            password: ''
        }
    })

    // Handle form submission
    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const response = await dispatch(login(values)); // Dispatch login action
        
        if (login.fulfilled.match(response)) {
            router.push('/job'); // Redirect to job page on successful login
        }
    }

    return (
        <Card className='w-96'> {/* Card container with fixed width */}
            <CardHeader>
                <CardTitle className='text-center mb-4'>
                    <h2 className='text-xl'>Login</h2>
                </CardTitle>
                <Image src={'/images/logo.png'} width={400} height={200} alt='Logo' /> {/* Display logo */}
            </CardHeader>
            <CardContent>
                <Form {...form}> {/* Form wrapper for validation */}
                    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-2'>
                        
                        {/* Username Input Field */}
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Username' {...field} />
                                    </FormControl>
                                    <FormMessage /> {/* Displays validation errors */}
                                </FormItem>
                            )}
                        />

                        {/* Password Input Field */}
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Password' type='password' {...field} />
                                    </FormControl>
                                    <FormMessage /> {/* Displays validation errors */}
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button type='submit' className='w-full my-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                            Login
                        </Button>
                    </form>
                </Form>

                {/* Link to Register Page */}
                <p className='text-sm my-3'>
                    Don't you have an account?
                    <Link href={'/auth/register'} className='text-blue-600 hover:underline ml-2'>Create One</Link>
                </p>
            </CardContent>
        </Card>
    )
}

export default LoginPage;
