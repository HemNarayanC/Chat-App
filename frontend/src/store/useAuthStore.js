import { create } from 'zustand'
import axiosInstance from '../lib/axios'
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === "development" ? `${import.meta.env.VITE_SERVER_URL}/api` : "/"

const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
            get().connectSocket();

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
            get().connectSocket();

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
                get().connectSocket();
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
            get().disconnectSocket();
        } catch (error) {
            console.log("Error in logging out", error);
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in updating profile", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser || socket?.connected) return;

        const socketInstance = io(BASE_URL, { withCredentials: true, auth: {
            userId: authUser.user._id,
        }});

        socketInstance.on("connect", () => {
            console.log("Socket connected with id:", socketInstance.id);
        });

        socketInstance.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });

        set({ socket: socketInstance });

        socketInstance.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds})
        })
    },

    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },


}));

export default useAuthStore