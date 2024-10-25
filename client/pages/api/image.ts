import { getTouristSpots } from "@/lib/utils";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    const { locationName } = req.query;
    const image = await getTouristSpots(locationName as string, process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string);
    console.log(image)
    res.status(200).json({ image: image as string });
}
