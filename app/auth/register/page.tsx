'use client'; // Ensures this component runs on the client side in Next.js

import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod'; // Enables Zod validation for React Hook Form
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
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

import { useDispatch } from 'react-redux'; // Hook for dispatching Redux actions
import { AppDispatch } from '@/store/store';
import { register } from '@/store/features/auth/authSlice'; // Importing the register action from Redux auth slice

// Define form validation schema using Zod
const formSchema = z.object({
    username: z.string().min(1, {message: 'Username is required.'}), // Ensures username is not empty
    password: z.string().min(1, {message: 'Password is required.'}), // Ensures password is not empty
    email: z.string().email(), // Ensures a valid email format
    accountType: z.enum(['client', 'pilot']) // Restricts accountType to either 'client' or 'pilot'
});

const LoginPage: FC = () => {

    const dispatch = useDispatch<AppDispatch>(); // Getting dispatch function from Redux

    // Initializing React Hook Form with validation and default values
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), // Connects Zod schema for validation
        defaultValues: {
            username: '',
            password: '',
            email: '',
            accountType: 'client' // Default account type set to 'client'
        }
    });

    // Handles form submission and dispatches the register action to Redux store
    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        dispatch(register(values)); // Dispatches registration action with form values
    };

    return (
        <Card className='w-96'> {/* Wrapper card with a fixed width */}
            <CardHeader>
                <CardTitle className='text-center mb-4'>
                    <h2 className='text-xl'>
                        Register
                    </h2>
                </CardTitle>
                <Image src={'/images/logo.png'} width={400} height={200} alt='Logo' /> {/* Displays logo */}
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-2'>
                        
                        {/* Username field */}
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Username' {...field} />
                                    </FormControl>
                                    <FormMessage /> {/* Displays validation error message if any */}
                                </FormItem>
                            )}
                        />
                        
                        {/* Password field */}
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
                        
                        {/* Email field */}
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Email' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {/* Account Type selection */}
                        <FormField
                            control={form.control}
                            name='accountType'
                            render={({ field}) => (
                                <FormItem>
                                    <FormLabel>Account Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select account type' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='client'>Client</SelectItem>
                                            <SelectItem value='pilot'>Pilot</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit button with an icon */}
                        <Button type='submit' className='w-full my-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                            Register
                        </Button>
                    </form>
                </Form>

                {/* Login link for users who already have an account */}
                <p className='text-sm my-3'>
                    Already have an account?
                    <Link href={'/auth/login'} className='text-blue-600 hover:underline ml-2'>Login</Link>
                </p>
            </CardContent>
        </Card>
    );
};

export default LoginPage;
