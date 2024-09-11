/**
 * Global state management
 */

import { create } from "zustand";

// User States
interface IUser {
    appID: string;
    accessToken?: string;
    wallet?: string;
    pfp?: string;
}

interface UserStore {
    user: IUser | null;
    setUser: (user: IUser) => void;
}

export const useUserStore = create<UserStore>(set => ({
    user: null,
    setUser: user => set(() => ({ user })),
}));

// Modal States
interface ModalStore {
    modal: "custom" | "login" | null;
    options: any;
    loading: boolean;
    setModal: (type: "custom" | "login" | null, options: any) => void;
    setLoading: (loading: boolean) => void;
}

export const useModalStore = create<ModalStore>(set => ({
    modal: null,
    options: {},
    loading: false,
    setModal: (type, options = {}) =>
        set(() => ({
            modal: type,
            options: options,
        })),
    setLoading: loading => set(() => ({ loading })),
}));
