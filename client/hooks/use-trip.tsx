import { atom, useAtom } from 'jotai';

export const tripAtom = atom({
    user_id: "",
    source: "",
    destination: "",
    vehicle: {
        name: "",
        price: 0,
        type: ""
    },
    hotel: {
        name: "",
        price: 0,
        room_qty: 0
    },
});


export const useTrip = () => useAtom(tripAtom);