import type { NextApiRequest, NextApiResponse } from "next";

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const options = {
            method: 'GET',
            headers: {
                Authorization: req.headers.authorization as string,
            }
        };
        const { from_city, to_city, date_of_journey } = req.query;
        const data = await (await fetch(`https://webapi.shohoz.com/v1.0/web/booking/bus/search-trips?from_city=${from_city}&to_city=${to_city}&date_of_journey=${date_of_journey}&dor=`,
            options)).json();
        res.status(200).json(data?.data?.trips);
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
