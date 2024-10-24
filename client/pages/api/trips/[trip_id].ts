import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/mongodb";
import Trip from "@/lib/models/trip";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { trip_id } = req.query;
  
    await dbConnect();
  
    try {
      const trip = await Trip.findOne({ trip_id: trip_id });
  
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
  
      return res.status(200).json(trip);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  }