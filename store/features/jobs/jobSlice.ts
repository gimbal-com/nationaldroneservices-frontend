import { toast } from "@/hooks/use-toast";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { setAuthToken } from "@/lib/axios";

export interface JobData {
    id: number,
    title: string,
    description: string,
    budget: number,
    date_created: string,
    status: string,
    address: string,
    user_id: number
}

export interface FolderData {
    id: number,
    job_id?: number,
    name: string,
    created_at?: string
}

export interface FileDate {
    id: number,
    job_id: number,
    folder_id: number,
    name: string,
    path: string,
    uploaded_at: string
}

interface JobState {
    jobList: JobData[];
    jobDetail: JobData | null;
    folderList: FolderData[];
    fileList: FileDate[];
    loading: boolean;
    error: string | null;
}

const initialState: JobState = {
    jobList: [],
    jobDetail: null,
    folderList: [],
    fileList: [],
    loading: false,
    error: null
}

//Async Redux Action to call POST /api/jobs API to create a new job
export const createJob = createAsyncThunk('jobs/createJob', async (jobData: any, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/api/jobs`, jobData);
        toast({ description: response.data.message, variant: 'default' });
        return response.data;
    } catch (error: any) {
        toast({ description: error.response.data.message, variant: 'destructive' });
        return rejectWithValue('Failed to create job');
    }
});

//Async Redux Action to call GET /api/jobs API to get joblist
export const getJobList = createAsyncThunk('jobs/getJobList', async (userId: any, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/api/jobs?userId=${userId}`);
        return response.data;
    } catch (error: any) {
        return rejectWithValue('Failed to get jobs');
    }
});

//Async Redux Action to call GET /api/jobs API to get jobDetail
export const getJobDetail = createAsyncThunk('jobs/getJobDetail', async (jobId: number, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/api/jobs/${jobId}`);
        return response.data;
    } catch (error: any) {
        return rejectWithValue('Failed to get job detail');
    }
});

//Async Redux Action to call GET /api/jobs API to get Folder by JobId
export const getFoldersByJobId = createAsyncThunk('jobs/getFoldersByJobId', async (jobId: number, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/api/jobs/${jobId}/folders`);

        return response.data;
    } catch (error: any) {
        return rejectWithValue('Failed to get folders');
    }
});

//Async Redux Action to call POST /api/jobs API to create Folder by JobId
export const createFolderByJobId = createAsyncThunk('jobs/createFolderByJobId', async ({ jobId, name }: { jobId: number, name: string }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/api/jobs/${jobId}/folders`, { name });
        toast({ description: response.data.message, variant: 'default' });
        return response.data;
    } catch (error: any) {
        toast({ description: error.response.data.message, variant: 'destructive' });
        return rejectWithValue('Failed to create folder');
    }
});

//Async Redux Action to call GET /api/jobs API to get Files by JobId and FolderId
export const getFilesByJobIdAndFolderId = createAsyncThunk('jobs/getFilesByJobIdAndFolderId', async ({ jobId, folderId }: { jobId: number, folderId: number }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/api/jobs/${jobId}/folders/${folderId}/files`);
        return response.data;
    } catch (error: any) {
        return rejectWithValue('Failed to get files');
    }
});

//Async Redux Action to call POST /api/jobs API to upload files
export const uploadFiles = createAsyncThunk('jobs/uploadFiles', async ({ jobId, folderId, files }: { jobId: number, folderId: number, files: File[] }, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const response = await axiosInstance.post(`/api/jobs/${jobId}/folders/${folderId}/files`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        toast({ description: response.data.message, variant: 'default' });
        return response.data;
    } catch (error: any) {
        toast({ description: error.response.data.message, variant: 'destructive' });
        return rejectWithValue('Failed to upload files');
    }
});

const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(getJobList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getJobList.fulfilled, (state, action) => {
                state.jobList = action.payload.jobs;
                state.loading = false;
                state.error = null;
            })
            .addCase(getJobDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getJobDetail.fulfilled, (state, action) => {
                state.jobDetail = action.payload.job;
                state.loading = false;
                state.error = null;
            })
            .addCase(createFolderByJobId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFolderByJobId.fulfilled, (state, action) => {
                state.folderList.push(action.payload.folder),
                    state.loading = false;
            })
            .addCase(getFoldersByJobId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFoldersByJobId.fulfilled, (state, action) => {
                state.loading = false;
                state.folderList = action.payload.folders;
            })
            .addCase(uploadFiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadFiles.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(getFilesByJobIdAndFolderId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFilesByJobIdAndFolderId.fulfilled, (state, action) => {
                state.loading = false;
                state.fileList = action.payload.files;
            })
    }
})

export default jobSlice.reducer;