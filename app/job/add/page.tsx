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

// Zod schema for form validation
const formSchema = z.object({
    title: z.string().min(1, { message: 'Title is required.' }),                 // Validate that the title is not empty
    description: z.string().min(1, { message: 'Description is required.' }),     // Validate that description is not empty
    address: z.string().min(1, { message: 'Location is required.' }),            // Validate that address is not empty
    budget: z.string().min(1, { message: 'Budget is required.' })                // Validate that budget is provided
});

const JobAddPage = () => {
    const [map, setMap] = useState<mapboxgl.Map>();                               // State to store the map instance
    const [geometry, setGemoetry] = useState<any>();                              // State to store drawn polygons/geometry
    const mapNode = useRef(null);                                                 // Ref to access the map container DOM element

    // Redux hooks to access dispatch and user data from the store
    const dispatch = useDispatch<AppDispatch>();
    const userId = useSelector<RootState>(store => store.auth.user?.id);

    // React Hook Form setup with Zod validation schema
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), // Zod schema for validation
        defaultValues: {
            title: '',
            description: '',
            address: '',
            budget: '0' // Default value for budget
        }
    });

    // Handle form submission, dispatches action to create job
    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        dispatch(createJob({...values, budget: Number(values.budget), polygons: geometry, userId}));
    };

    // useEffect hook for initializing the map and Mapbox Draw tool
    useEffect(() => {
        const node = mapNode.current;                                               // Get the map container DOM node

        if (typeof window === 'undefined' || node === null) return;                 // Check if the window object is available (to avoid issues during SSR)

        // Initialize the Mapbox map with default settings
        const mapboxMap = new mapboxgl.Map({
            container: node,
            accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,                      // Access token for Mapbox
            style: 'mapbox://styles/mapbox/streets-v11', // Map style
            center: [-74.5, 40],                                                    // Default map center (longitude, latitude)
            zoom: 3                                                                 // Default zoom level
        });

        // Initialize Mapbox Draw tool
        const draw = new MapboxDraw({
            displayControlsDefault: false,                                          // Disable default controls
            controls: {
                polygon: true,                                                      // Enable polygon drawing
                trash: true                                                         // Enable trash (delete) button
            }
        });

        mapboxMap.addControl(draw);                                                 // Add the draw control to the map

        // Listen for drawing events and update geometry state
        mapboxMap.on('draw.create', updateArea);
        mapboxMap.on('draw.delete', updateArea);
        mapboxMap.on('draw.update', updateArea);

        // Update area function called on drawing or updating polygons
        function updateArea() {
            const data = draw.getAll();                                             // Get all the drawn geometries
            if (data.features.length > 0) {
                setGemoetry(data.features);                                         // Store the drawn polygon in the state
            } else {
                console.log('No polygon selected');                                 // Log message if no polygon is drawn
            }
        }

        setMap(mapboxMap);                                                          // Set the map instance in state

        return () => {  
            mapboxMap.remove();                                                     // Cleanup the map on component unmount
        };
    }, []);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-xl">Create a New Job</span>
                <Link href={'/job'}>
                    <Button size={'sm'}>
                        <ArrowLeftIcon /> {/* Left arrow icon */}
                        Return to List
                    </Button>
                </Link>
            </div>
            <div className="flex gap-4">
                <div className="w-96">
                    <Form {...form}> {/* React Hook Form with Zod */}
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex flex-col gap-2">
                            {/* Title input */}
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
                            {/* Description input */}
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
                            {/* Budget input */}
                            <FormField
                                control={form.control}
                                name="budget"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Budget</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Budget" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Address input */}
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
                            {/* Submit and Cancel buttons */}
                            <div className="flex gap-2">
                                <Button type='submit' className="flex-1">Submit</Button>
                                <Button type='reset' className="flex-1" onClick={() => form.reset()}>Cancel</Button>
                            </div>
                        </form>
                    </Form>
                </div>
                <div className="flex-1">
                    {/* Map container */}
                    <div ref={mapNode} className="w-full h-[500px] rounded-lg" />
                </div>
            </div>
        </div>
    );
};

export default JobAddPage;
