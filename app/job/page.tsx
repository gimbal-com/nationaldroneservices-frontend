'use client'; // This indicates that this component is client-side only. It will run in the browser and not on the server.

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
    // Get the dispatch function from Redux to dispatch actions.
    const dispatch = useDispatch<AppDispatch>();

    // Get the job list from the Redux store (State management).
    const jobList = useSelector<RootState>(store => store.job.jobList);

    // Get the current user's ID from the Redux store.
    const userId = useSelector<RootState>(store => store.auth.user?.id);

    // Initialize the router for programmatic navigation.
    const router = useRouter();

    // Handler function that is called when a row in the table is clicked.
    // It navigates to the details page of the selected job.
    const handleRowClick = (id: number) => {
        router.push(`/job/${id}`); // Navigate to the job detail page based on the job ID.
    }

    // useEffect hook that fetches the job list when the component mounts (or when userId changes).
    // It ensures that the job list is always up-to-date.
    useEffect(() => {
        dispatch(getJobList(userId)); // Dispatch the action to get the job list for the current user.
    }, [dispatch, userId]);           // Re-run the effect when dispatch or userId changes.

    return (
        <div className='p-4'>
            {/* Header Section */}
            <div className="mb-4">
                <div className='flex items-center justify-between'>
                    <span className='text-xl font-bold'>Job List</span> {/* Title of the page */}
                    {/* Link to navigate to the Job Creation page */}
                    <Link href={'/job/add'}>
                        <Button size='sm' variant='default'>
                            <PlusIcon /> {/* Display a plus icon indicating the creation of a new job */}
                            Create a Job
                        </Button>
                    </Link>
                </div>
                <div className='my-2'>
                    {/* Table component for displaying the list of jobs */}
                    <Table className="border">
                        <TableCaption>A list of jobs</TableCaption> {/* Table caption describing the data */}
                        
                        {/* Table header defining columns for Job ID, Title, Status, and Date Created */}
                        <TableHeader>
                            <TableRow className='bg-slate-800 hover:bg-slate-800'>
                                <TableHead className='text-white'>ID</TableHead> {/* Column for Job ID */}
                                <TableHead className='text-white'>Title</TableHead> {/* Column for Job Title */}
                                <TableHead className='text-white'>Status</TableHead> {/* Column for Job Status */}
                                <TableHead className='text-white'>Date Created</TableHead> {/* Column for Date Created */}
                            </TableRow>
                        </TableHeader>

                        {/* Table body where the jobs are dynamically rendered from jobList */}
                        <TableBody>
                            {/* Mapping through jobList array and rendering rows */}
                            {
                                (jobList as any).map((item: any) => {
                                    return (
                                        <TableRow 
                                            key={item.id} // Unique key for each row in the table
                                            className='hover:bg-slate-200 cursor-pointer' // Style for hover effect and cursor change
                                            onClick={() => handleRowClick(item.id)} // Row click handler to navigate to the job detail page
                                        >
                                            <TableCell>{item?.id}</TableCell> {/* Display the job ID */}
                                            <TableCell>{item?.title}</TableCell> {/* Display the job title */}
                                            <TableCell>{item?.status}</TableCell> {/* Display the job status */}
                                            <TableCell>{item?.date_created}</TableCell> {/* Display the date when the job was created */}
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Section for displaying uploaded images (Not implemented yet in the provided code) */}
            <div>
                <span className='text-xl font-bold'>Uploaded Images</span> {/* Title for the uploaded images section */}
            </div>
        </div>
    );
}

export default JobList;
