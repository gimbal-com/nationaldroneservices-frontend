'use client'

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, FolderIcon, PlusIcon, FolderOpenIcon } from 'lucide-react';
import { createFolderByJobId, getFilesByJobIdAndFolderId, getFoldersByJobId, getJobDetail, uploadFiles } from "@/store/features/jobs/jobSlice";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
    folderName: z.string().min(1, { message: 'Folder Name required.' })
})

const JobDetail = () => {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const folderId = searchParams.get('folderId');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            folderName: ''
        }
    })

    const router = useRouter();

    const dispatch = useDispatch<AppDispatch>();
    const jobDetail: any = useSelector<RootState>(store => store.job.jobDetail);

    const [activeFolderId, setActiveFolderId] = useState<number>(-1);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState<boolean>(false);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [currentImage, setCurrentImage] = useState<string>('');

    useEffect(() => {
        dispatch(getJobDetail(Number(id)));
        dispatch(getFoldersByJobId(Number(id)));
    }, []);

    useEffect(() => {
        if (folderId) {
            dispatch(getFilesByJobIdAndFolderId({jobId: Number(id), folderId: Number(folderId)}));
        }
    }, [folderId])

    const folderList: any = useSelector<RootState>(store => store.job.folderList);
    const fileList: any = useSelector<RootState>(store => store.job.fileList);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        dispatch(createFolderByJobId({ jobId: Number(id), name: values.folderName }))
    }

    const handleClickFolderItem = (folderId: number) => {
        setActiveFolderId(folderId);
        router.push(`/job/${id}?folderId=${folderId}`)
    }

    const handleUploadCancel = () => {
        setSelectedFiles([]);
        setIsUploadDialogOpen(false);
    }

    const handleUploadFiles = async () => {
        if(selectedFiles.length) {
            const response = await dispatch(uploadFiles({jobId: Number(id), folderId: Number(folderId), files: selectedFiles}))
            setIsUploadDialogOpen(false);
            if (uploadFiles.fulfilled.match(response)) {
                dispatch(getFilesByJobIdAndFolderId({jobId: Number(id), folderId: Number(folderId)}));
            }
        } else {
            toast({description: 'Please select image files.', variant: 'destructive'})
        }
    }

    const handleShowImage = (path: string) => {
        setIsImageDialogOpen(true);
        setCurrentImage(path);
    }

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
                        <span className="text-md font-bold">Folder List</span>
                        <Dialog onOpenChange={() => form.reset()}>
                            <DialogTrigger asChild>
                                <Button size={'icon'} className="w-6 h-6">
                                    <PlusIcon />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Create a New Folder
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                                            <FormField
                                                control={form.control}
                                                name='folderName'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Folder Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button type='submit'>Create New</Button>
                                            </div>
                                        </form>
                                    </Form>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                        {
                            folderList.map((item: any) => {
                                return (
                                    <div
                                        key={item?.id}
                                        className={`flex items-center gap-2 hover:bg-slate-200 rounded-md px-3 py-1 cursor-pointer ${item?.id === Number(folderId) ? 'bg-slate-200' : ''}`}
                                        onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClickFolderItem(item.id)}
                                    >
                                        {
                                            item?.id === activeFolderId ?
                                                <FolderOpenIcon className="w-4 h-4" />
                                                :
                                                <FolderIcon className="w-4 h-4" />
                                        }
                                        <span className="text-xs">{item?.name}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-md font-bold">Uploaded Image List</span>
                        <div>
                            <Button size='sm' onClick={() => setIsUploadDialogOpen(true)} disabled={!folderId}>
                                <PlusIcon />
                                Upload Images
                            </Button>
                            <Dialog open={isUploadDialogOpen} onOpenChange={() => setIsUploadDialogOpen(!isUploadDialogOpen)}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Upload Images</DialogTitle>
                                    </DialogHeader>

                                    <Input type="file" onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))} multiple />

                                    <DialogFooter>
                                        <Button
                                            onClick={handleUploadFiles}    
                                        >
                                            Upload
                                        </Button>
                                        <Button
                                            onClick={handleUploadCancel}
                                        >
                                            Cancel
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-2">
                    {
                        fileList?.map((item: any, idx: number) => {
                            return (
                                <div className="h-60 border rounded-md flex items-center justify-center cursor-pointer" key={idx} onDoubleClick={() => handleShowImage(item.path)}>
                                    <Image src={`${process.env.NEXT_PUBLIC_API_URL}/images/${item?.path}`} width={200} height={200} alt={item?.path} className="object-contain" />
                                </div>
                            )
                        })
                    }
                    </div>
                    <Dialog open={isImageDialogOpen} onOpenChange={() => setIsImageDialogOpen(!isImageDialogOpen)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Image Detail</DialogTitle>
                            </DialogHeader>
                            <Image width={1000} height={500} alt={currentImage} src={`${process.env.NEXT_PUBLIC_API_URL}/images/${currentImage}`} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}

export default JobDetail;