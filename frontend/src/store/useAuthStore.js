import { create } from 'zustand'
import axiosInstance from '../lib/axios'
import toast from 'react-hot-toast';

const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({ authUser: null });
        }
        finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', data, { withCredentials: true });
            if (res.data.success) {
                set({ authUser: res.data });
                toast.success(res.data.message || "Logged in successfully");
                return res.data;
            } else {
                toast.error(res.data.message || "Invalid credentials");
                return res.data;
            }
        } catch (error) {
            console.log("Error in logging in", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            console.log("Error in logging out", error);
            toast.error(error.response.data.message);
        }
    }
}));

export default useAuthStore