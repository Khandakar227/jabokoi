import { Schema, model, models, Document } from 'mongoose';

// Define an interface for the Trip document
export interface ITrip extends Document {
  trip_id: string;
  user_id: Schema.Types.ObjectId;
  source: string;
  destination: string;
  genre: string;
  bus: boolean;
  train: boolean;
  plane: boolean;
  meal: boolean;
  hotel: boolean;
  blog: string;
  cover_photo: string;
  photos: string[];
}

// Create the Trip schema
const tripSchema = new Schema<ITrip>({
  trip_id: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  bus: {
    type: Boolean,
    default: false
  },
  train: {
    type: Boolean,
    default: false
  },
  plane: {
    type: Boolean,
    default: false
  },
  meal: {
    type: Boolean,
    default: false
  },
  hotel: {
    type: Boolean,
    default: false
  },
  blog: {
    type: String,
    default: ''
  },
  cover_photo: {
    type: String,
    default: ''
  },
  photos: {
    type: [String], // Array of strings for photo paths/URLs
    default: []
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Export the model
const Trip = models.Trip || model<ITrip>('Trip', tripSchema);
export default Trip;
