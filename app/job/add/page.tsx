'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { createJob } from "@/store/features/jobs/jobSlice";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
    title: z.string().min(1, { message: 'Title is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
    address: z.string().min(1, { message: 'Location is required.' }),
    budget: z.string().min(1, { message: 'Budget is required.' })
})

const JobAddPage = () => {

    const [map, setMap] = useState<mapboxgl.Map>();
    const [geometry, setGemoetry] = useState<any>();
    const mapNode = useRef(null);

    const dispatch = useDispatch<AppDispatch>();
    const userId = useSelector<RootState>(store => store.auth.user?.id);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            address: '',
            budget: '0'
        }
    })

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        dispatch(createJob({...values, budget: Number(values.budget), polygons: geometry, userId}));
    }

    useEffect(() => {
        const node = mapNode.current;

        if (typeof window === 'undefined' || node === null) return;

        const mapboxMap = new mapboxgl.Map({
            container: node,
            accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-74.5, 40],
            zoom: 3
        })

        const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true
            }
        })

        mapboxMap.addControl(draw);

        mapboxMap.on('draw.create', updateArea);
        mapboxMap.on('draw.delete', updateArea);
        mapboxMap.on('draw.update', updateArea);

        function updateArea() {
            const data = draw.getAll();
            if (data.features.length > 0) {
                setGemoetry(data.features);
            } else {
                console.log('No polygon selected');
            }
        }

        setMap(mapboxMap);

        return () => {  
            mapboxMap.remove();
        }
    }, []);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-xl">Create a New Job</span>
                <Link href={'/job'}>
                    <Button size={'sm'}>
                        <ArrowLeftIcon />
                        Return to List
                    </Button>
                </Link>
            </div>
            <div className="flex gap-4">
                <div className="w-96">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Job Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Job Description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="budget"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Budget</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Budget" {...field}  />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-2">
                                <Button type='submit' className="flex-1">Submit</Button>
                                <Button type='reset' className="flex-1" onClick={() => form.reset()}>Cancel</Button>
                            </div>
                        </form>
                    </Form>
                </div>
                <div className="flex-1">
                    <div ref={mapNode} className="w-full h-[500px] rounded-lg" />
                </div>
            </div>
        </div>
    )
}

export default JobAddPage