import { getNearbyHotels } from "@/lib/utils";
import type { NextApiRequest, NextApiResponse } from "next";

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { lat, long, arrival_date, days_to_stay, room_qty } = req.query;
        const data = await getNearbyHotels(lat as string, long as string, arrival_date as string, {days_to_stay: +(days_to_stay || 1), room_qty: +(room_qty || 1)});
        console.log(data)
        res.status(200).json(data?.data);
    } catch (error) {
        console.log(error);
        res.status(403).json({ error: (error as Error).message });
    }
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'GET')
        return GET(req, res);
    res.status(404).json({ error: 'Invalid Method' });
}
