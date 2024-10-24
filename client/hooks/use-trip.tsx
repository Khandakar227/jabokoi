import { atom } from 'jotai';

export const tripAtom = atom({
    user_id: "",
    source: "",
    destination: "",
    bus: {
        name: "",
        price: 0
    },
    train: {
        name: "",
        price: 0
    },
})