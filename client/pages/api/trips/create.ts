import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/mongodb';
import Trip from '@/lib/models/trip';

// The handler to create a new trip
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const {
        trip_id,
        user_id,
        source,
        destination,
        genre,
        bus,
        train,
        plane,
        meal,
        hotel,
        blog,
        cover_photo,
        photos,
      } = req.body;

      // Validate the required fields
      if (!trip_id || !user_id || !source || !destination || !genre) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Create a new trip
      const newTrip = new Trip({
        trip_id,
        user_id,
        source,
        destination,
        genre,
        bus: bus || false,
        train: train || false,
        plane: plane || false,
        meal: meal || false,
        hotel: hotel || false,
        blog: blog || '',
        cover_photo: cover_photo || '',
        photos: photos || []
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
