import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/mongodb';
import Trip from '@/lib/models/trip';

// The handler to create a new trip
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const {
        user_id,
        source,
        destination,
        hotel,
        vehicle
        } = req.body;

      // Validate the required fields
      if (!user_id || !source || !destination || !vehicle || !hotel)
        return res.status(400).json({ message: 'Missing required fields' });
      

      // Create a new trip
      const newTrip = new Trip({
        user_id,
        source,
        destination,
        hotel: hotel,
        vehicle: vehicle,
      });

      // Save the trip to the database
      await newTrip.save();

      return res.status(201).json({ message: 'Trip created successfully', trip: newTrip });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  } else {
    // Handle non-POST requests
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
