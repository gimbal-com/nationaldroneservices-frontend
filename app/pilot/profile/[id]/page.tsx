'use client';

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { getPilotCerts } from "@/store/features/auth/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Separator } from "@radix-ui/react-select";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get } from "http";

const PilotProfilePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user: any = useSelector<RootState>(store => store.auth.user);
    const { id } = useParams();

    useEffect(() => {
        dispatch(getPilotCerts(Number(id)));
    }, [dispatch])

    return (
        <div className="p-4">
            <div className="flex w-full flex-col gap-2">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">Username: </span>
                    <span>{user?.username}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">Email: </span>
                    <span>{user?.email}</span>
                </div>
                <Separator />
                <div className="">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold mb-3">Certificates</h3>
                        <Button size={'sm'}>
                            <PlusIcon />
                            Add New Certificates
                        </Button>
                    </div>
                    <div className="grid grid-cols-4">
                        {
                            user?.certs?.map((item: any) => {
                                return (
                                    <div className="border p-4 h-40 rounded-md">
                                        <Image src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/certs/${item?.path}`} width={300} height={200} alt={item?.path} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PilotProfilePage;