import { Schema, model, models, Document } from 'mongoose';

// Define an interface for the Trip document
export interface ITrip {
  user_id: Schema.Types.ObjectId;
  source: string;
  destination: string;
  vehicle: {name: string, price:  number, type: string};
  plane: {name: string, price:  number};
  hotel: {
    name: string;
    price: number;
    room_qty: number;
  };
  blog: string;
  cover_photo: string;
  photos: string[];
}

// Create the Trip schema
const tripSchema = new Schema({
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
  vehicle: {
    name: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'bus'
    }
  },
  hotel: {
    name: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      default: 0
    },
    room_qty: {
      type: Number,
      default: 0
    }
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
