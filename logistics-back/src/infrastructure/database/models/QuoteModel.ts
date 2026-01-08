import mongoose, { Schema, Document } from 'mongoose';

/**
 * MongoDB Document interface for Quote
 */
export interface IQuoteDocument extends Document {
  providerId: string;
  providerName: string;
  price: number;
  currency: string;
  minDays: number;
  maxDays: number;
  transportMode: string;
  isCheapest: boolean;
  isFastest: boolean;
  requestData: {
    origin: string;
    destination: string;
    weight: number;
    pickupDate: Date;
    fragile: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Quote Schema for MongoDB
 * Includes TTL index for automatic cache expiration (5 minutes)
 */
const QuoteSchema = new Schema<IQuoteDocument>(
  {
    providerId: { 
      type: String, 
      required: true, 
      index: true 
    },
    providerName: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true,
      min: 0 
    },
    currency: { 
      type: String, 
      default: 'USD' 
    },
    minDays: { 
      type: Number, 
      required: true,
      min: 0 
    },
    maxDays: { 
      type: Number, 
      required: true,
      min: 0 
    },
    transportMode: { 
      type: String, 
      required: true 
    },
    isCheapest: { 
      type: Boolean, 
      default: false 
    },
    isFastest: { 
      type: Boolean, 
      default: false 
    },
    requestData: {
      origin: { 
        type: String, 
        required: true 
      },
      destination: { 
        type: String, 
        required: true 
      },
      weight: { 
        type: Number, 
        required: true,
        min: 0.1,
        max: 1000 
      },
      pickupDate: { 
        type: Date, 
        required: true 
      },
      fragile: { 
        type: Boolean, 
        default: false 
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// TTL index for automatic cache expiration (5 minutes = 300 seconds)
QuoteSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

// Compound index for efficient cache lookup
QuoteSchema.index({
  'requestData.origin': 1,
  'requestData.destination': 1,
  'requestData.weight': 1,
  'requestData.fragile': 1,
});

/**
 * Quote Model for MongoDB operations
 */
export const QuoteModel = mongoose.model<IQuoteDocument>('Quote', QuoteSchema);
