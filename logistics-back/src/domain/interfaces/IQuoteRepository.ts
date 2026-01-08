import { Quote } from '../entities/Quote';
import { QuoteRequest } from '../entities/QuoteRequest';

/**
 * Repository interface for Quote persistence
 * Following Repository Pattern for data access abstraction
 */
export interface IQuoteRepository {
  /**
   * Save a single quote to the database
   * @param quote - Quote entity to save
   * @param request - Original request data for context
   */
  save(quote: Quote, request: QuoteRequest): Promise<void>;

  /**
   * Save multiple quotes in a batch operation
   * @param quotes - Array of quote entities
   * @param request - Original request data for context
   */
  saveMany(quotes: Quote[], request: QuoteRequest): Promise<void>;

  /**
   * Find cached quotes for a specific request (within 5 minutes TTL)
   * @param request - Quote request to lookup
   * @returns Array of cached quotes or null if not found
   */
  findCached(request: QuoteRequest): Promise<Quote[] | null>;

  /**
   * Get all quotes for analytics purposes
   * @param limit - Maximum number of quotes to retrieve (default: 100)
   * @returns Array of quote entities
   */
  findAll(limit?: number): Promise<Quote[]>;
}
