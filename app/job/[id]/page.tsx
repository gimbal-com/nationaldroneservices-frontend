'use client'

import { getJobDetail } from "@/store/features/jobs/jobSlice";
import { AppDispatch, RootState } from "@/store/store";
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

    return (
        <div className="p-4">
            <div className="flex items-center justify-between">
                <span className="font-bold text-xl">{`Details of "${jobDetail?.title}"`}</span>
            </div>
        </div>
    )
}

export default JobDetail;