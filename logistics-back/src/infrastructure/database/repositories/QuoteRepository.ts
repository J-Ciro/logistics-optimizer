import { IQuoteRepository } from '../../../domain/interfaces/IQuoteRepository';
import { Quote } from '../../../domain/entities/Quote';
import { QuoteRequest } from '../../../domain/entities/QuoteRequest';
import { QuoteModel } from '../models/QuoteModel';

/**
 * MongoDB implementation of Quote Repository
 * Handles persistence and cache lookup with 5-minute TTL
 */
export class QuoteRepository implements IQuoteRepository {
  private readonly CACHE_TTL_MINUTES = 5;

  /**
   * Save a single quote to the database
   */
  async save(quote: Quote, request: QuoteRequest): Promise<void> {
    await QuoteModel.create({
      providerId: quote.providerId,
      providerName: quote.providerName,
      price: quote.price,
      currency: quote.currency,
      minDays: quote.minDays,
      maxDays: quote.maxDays,
      transportMode: quote.transportMode,
      isCheapest: quote.isCheapest,
      isFastest: quote.isFastest,
      requestData: {
        origin: request.origin,
        destination: request.destination,
        weight: request.weight,
        pickupDate: request.pickupDate,
        fragile: request.fragile,
      },
    });
  }

  /**
   * Save multiple quotes in batch
   */
  async saveMany(quotes: Quote[], request: QuoteRequest): Promise<void> {
    const documents = quotes.map(quote => ({
      providerId: quote.providerId,
      providerName: quote.providerName,
      price: quote.price,
      currency: quote.currency,
      minDays: quote.minDays,
      maxDays: quote.maxDays,
      transportMode: quote.transportMode,
      isCheapest: quote.isCheapest,
      isFastest: quote.isFastest,
      requestData: {
        origin: request.origin,
        destination: request.destination,
        weight: request.weight,
        pickupDate: request.pickupDate,
        fragile: request.fragile,
      },
    }));

    await QuoteModel.insertMany(documents);
  }

  /**
   * Find cached quotes (within 5 minutes)
   * Returns null if no cache found
   */
  async findCached(request: QuoteRequest): Promise<Quote[] | null> {
    const cacheThreshold = new Date(Date.now() - this.CACHE_TTL_MINUTES * 60 * 1000);

    const cachedQuotes = await QuoteModel.find({
      'requestData.origin': request.origin,
      'requestData.destination': request.destination,
      'requestData.weight': request.weight,
      'requestData.fragile': request.fragile,
      createdAt: { $gte: cacheThreshold },
    }).sort({ createdAt: -1 });

    if (cachedQuotes.length === 0) {
      return null;
    }

    // Convert MongoDB documents to Quote entities
    return cachedQuotes.map(doc => new Quote({
      providerId: doc.providerId,
      providerName: doc.providerName,
      price: doc.price,
      currency: doc.currency,
      minDays: doc.minDays,
      maxDays: doc.maxDays,
      transportMode: doc.transportMode,
      isCheapest: doc.isCheapest,
      isFastest: doc.isFastest,
    }));
  }

  /**
   * Get all quotes for analytics
   */
  async findAll(limit: number = 100): Promise<Quote[]> {
    const documents = await QuoteModel.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    return documents.map(doc => new Quote({
      providerId: doc.providerId,
      providerName: doc.providerName,
      price: doc.price,
      currency: doc.currency,
      minDays: doc.minDays,
      maxDays: doc.maxDays,
      transportMode: doc.transportMode,
      isCheapest: doc.isCheapest,
      isFastest: doc.isFastest,
    }));
  }
}
