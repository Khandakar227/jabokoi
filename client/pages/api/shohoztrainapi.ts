import type { NextApiRequest, NextApiResponse } from "next";

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const options = {
            method: 'GET',
            headers: {
                Authorization: req.headers.authorization as string,
            }
        };
        const { from_city, to_city, date_of_journey, seat_class } = req.query;
        let _from_city = (from_city as string).replace('Chittagong', 'Chattogram');
        let _to_city = (to_city as string).replace('Chittagong', 'Chattogram');

        console.log(_from_city, _to_city, date_of_journey, seat_class);

        const data = await (await fetch(`https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=${_from_city}&to_city=${_to_city}&date_of_journey=${date_of_journey}&seat_class=${seat_class}`,
            options)).json();
        console.log(data);
        res.status(200).json(data?.data?.trains);
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
