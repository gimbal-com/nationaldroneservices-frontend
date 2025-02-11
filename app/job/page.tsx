'use client';

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getJobList } from "@/store/features/jobs/jobSlice";
import { AppDispatch, RootState } from "@/store/store";
import { PlusIcon } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const JobList = () => {

    const dispatch = useDispatch<AppDispatch>();

    const jobList = useSelector<RootState>(store => store.job.jobList);
    const userId = useSelector<RootState>(store => store.auth.user?.id);

    const router = useRouter();

    const handleRowClick = (id: number) => {
        router.push(`/job/${id}`);
    }

    useEffect(() => {
        dispatch(getJobList(userId));
    }, [dispatch, userId])

    return (
        <div className='p-4'>
            <div className="mb-4">
                <div className='flex items-center justify-between'>
                    <span className='text-xl font-bold'>Job List</span>
                    <Link href={'/job/add'}>
                        <Button size='sm' variant='default'>
                            <PlusIcon />
                            Create a Job
                        </Button>
                    </Link>
                </div>
                <div className='my-2'>
                    <Table className="border">
                        <TableCaption>A list of jobs</TableCaption>
                        <TableHeader>
                            <TableRow className='bg-slate-800 hover:bg-slate-800'>
                                <TableHead className='text-white'>ID</TableHead>
                                <TableHead className='text-white'>Title</TableHead>
                                <TableHead className='text-white'>Status</TableHead>
                                <TableHead className='text-white'>Date Created</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                (jobList as any).map((item: any) => {
                                    return (
                                        <TableRow key={item.id} className='hover:bg-slate-200 cursor-pointer' onClick={() => handleRowClick(item.id)}>
                                            <TableCell>{item?.id}</TableCell>
                                            <TableCell>{item?.title}</TableCell>
                                            <TableCell>{item?.status}</TableCell>
                                            <TableCell>{item?.date_created}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div>
                <span className='text-xl font-bold'>Uploaded Images</span>
            </div>
        </div>
    )
}

export default JobList;