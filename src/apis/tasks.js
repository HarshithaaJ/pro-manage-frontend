import axios from "axios"
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getTasksAnalytics = async ()=> {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await axios.get(`${backendUrl}/tasks/analytics`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const {analytics} = response.data.data;
        return {data: analytics, error: ""}
    } catch (error) {
        return {data: null, error: error.response?.data?.message || "Something went wrong"}
    }
}

export const getAllTasks = async (duration="Week")=> {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await axios.get(`${backendUrl}/tasks/`, {
            params: {
                duration
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const {tasks} = response.data.data;
        return {data: tasks, error: ""}
    } catch (error) {
        return {data: null, error: error.response?.data?.message || "Something went wrong"}
    }
}

export const updateTaskState = async (newState, taskId)=> {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await axios.patch(`${backendUrl}/tasks/state/${taskId}`, {
            state: newState
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if(response.status !== 204) throw new Error();
        return {data: "State updated successfully", error: ""}
    } catch (error) {
        return {data: null, error: error.response?.data?.message || "Something went wrong"}
    }
}

export const createTask = async (newTask)=> {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await axios.post(`${backendUrl}/tasks/`, {
            ...newTask
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const {task} = response.data.data;
        return {data: task, error: ""}
    } catch (error) {
        return {data: null, error: error.response?.data?.message || "Something went wrong"}
    }
}

export const editTask = async (updatedTask, taskId)=> {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await axios.put(`${backendUrl}/tasks/${taskId}`, {
            ...updatedTask
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

       const {task} = response.data.data;
       return {data: task, error: ""}
    } catch (error) {
        return {data: null, error: error.response?.data?.message || "Something went wrong"}
    }
}

export const deleteTask = async (taskId)=> {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await axios.delete(`${backendUrl}/tasks/${taskId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if(response.status !== 204) throw new Error();
        return {data: "Task deleted successfully", error: ""}
    } catch (error) {
        return {data: null, error: error.response?.data?.message || "Something went wrong"}
    }
}

export const updateTaskChecklist = async (taskId, checklistId, isChecked)=> {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await axios.patch(`${backendUrl}/tasks/${taskId}/checklists/${checklistId}`, {
            isChecked
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if(response.status !== 204) throw new Error();
        return {data: "Checklist updated successfully", error: ""}
    } catch (error) {
        return {data: null, error: error.response?.data?.message || "Something went wrong"}
    }
}

export const getTaskById = async (taskId)=> {
    try {
        const response = await axios.get(`${backendUrl}/tasks/${taskId}`);

        const {task} = response.data.data;
        return {data: task, error: ""}
    } catch (error) {
        return {data: null, error: error.response?.data?.message || "Something went wrong"}
    }
}