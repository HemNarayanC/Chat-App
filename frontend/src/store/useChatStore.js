import { create } from 'zustand'
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import useAuthStore from './useAuthStore';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            if (Array.isArray(res.data.filteredUsers)) {
                set({ users: res.data.filteredUsers });
            } else {
                console.error("Expected an array of users, but got:", res.data);
                toast.error("Error: Users data is not in the expected format.");
                set({ users: [] }); // Fallback to an empty array
            }
        } catch (error) {
            console.log("Error in fetching all users", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            console.log("Getting messages", res);
            set({ messages: res.data.messages })
        } catch (error) {
            console.log("Error in fetching messages", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            console.log("Response after sending the message ", res);
            set({ messages: [...messages, res.data.newMessage] });
        } catch (error) {
            console.log("Error in sending message", error);
            toast.error(error.response.data.newMessage.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (newMessage) => {
            set({
                messages: [...get().messages, newMessage],
            })
        })
    },

    unSubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    //todo: optimize this later on...
    setSelectedUser: (selectedUser) => set({ selectedUser })
}))