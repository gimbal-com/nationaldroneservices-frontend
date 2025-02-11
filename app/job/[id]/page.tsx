'use client'

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, FolderIcon, PlusIcon } from 'lucide-react';
import { getJobDetail } from "@/store/features/jobs/jobSlice";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const JobDetail = () => {
    const { id } = useParams();

    const dispatch = useDispatch<AppDispatch>();
    const jobDetail: any = useSelector<RootState>(store => store.job.jobDetail);

    useEffect(() => {
        dispatch(getJobDetail(Number(id)));
    }, []);

    const folderList = [
        {
            id: 1,
            name: "Folder 1"
        },
        {
            id: 2,
            name: "Folder 2"
        },
        {
            id: 3,
            name: "Folder 3"
        }
    ]

    return (
        <div className="p-4">
            <div className="flex items-center justify-between">
                <span className="font-bold text-xl">{`Details of "${jobDetail?.title}"`}</span>
                <Link href={'/job'}>
                    <Button size="sm">
                        <ArrowLeftIcon />
                        Return to List
                    </Button>
                </Link>
            </div>
            <div className="flex mt-8">
                <div className="w-80 border-r pr-4 mr-4">
                    <div className="flex items-center justify-between">
                        <span className="text-md font-bold mb-4">Folder List</span>
                        <Button size={'icon'} className="w-6 h-6 -mt-3">
                            <PlusIcon />
                        </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                    {
                        folderList.map(item => {
                            return (
                                <div key={item.id} className="flex items-center gap-2 hover:bg-slate-200 rounded-md px-3 py-1 cursor-pointer">
                                    <FolderIcon className="w-4 h-4" />
                                    <span className="text-xs">{item.name}</span>
                                </div>
                            )
                        })
                    }
                    </div>
                </div>
                <div className="flex-1">

                </div>
            </div>
        </div>
    )
}

export default JobDetail;