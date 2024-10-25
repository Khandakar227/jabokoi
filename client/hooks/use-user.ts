import { atom, useAtom } from "jotai";

const userAtom = atom<{
    _id: string,
    name: string,
    email: string,
    isVerified: boolean,
    role: string
} | null>(null);

export const useUser = () => useAtom(userAtom);
