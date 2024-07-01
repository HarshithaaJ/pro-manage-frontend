import axios from "axios"
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const registerUser = async ({name, email, password})=> {
    try {
        const response = await axios.post(`${backendUrl}/users/register`, {
            name,
            email,
            password
        })

        const {user, accessToken} = response.data.data
        return {data: {name: user.name, id: user._id, accessToken}, error: ""}
    } catch (error) {
        return {data: null, error: error.response?.data?.message || "Something went wrong."}
    }
}

export const loginUser = async ({email, password})=> {
    try {
        const response = await axios.post(`${backendUrl}/users/login`, {
            email,
            password
        })

        const {user, accessToken} = response.data.data;
        return {data: {name: user.name, id: user._id, accessToken}, error: ""}
    } catch (error) {
        return {data: null, error: error.response?.data?.message || "Something went wrong."}
    }
}

export const validateUserFromToken = async (accessToken)=> {
    try {
        const response = await axios.get(`${backendUrl}/users/user`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const {user} = response.data.data;
        return {data: {id: user._id, name: user.name}, error: ""}
    } catch (error) {
        return {data: null, error: error.response?.data?.message || "Invalid Access Token"}
    }
}

export const updateAccountInfo = async ({name, oldPassword="", newPassword=""})=> {
    const accessToken = localStorage.getItem("accessToken");
    try {
        const response = await axios.patch(`${backendUrl}/users/account`, {
            name,
            oldPassword,
            newPassword
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if(response.status !== 204) throw new Error();
        return {data: "Account updated successfully", error: ""}
    } catch (error) {
        return {data: null, error: error.response?.data?.message || "Something went wrong"}
    }
}