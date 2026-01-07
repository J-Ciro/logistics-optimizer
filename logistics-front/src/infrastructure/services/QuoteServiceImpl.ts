/**
 * @file QuoteServiceImpl.ts
 * @description Quote service implementation with dependency injection
 * Implements Dependency Inversion Principle
 */

import type { IQuoteRequest } from '../../domain/models/QuoteRequest';
import type { IQuoteResponse } from '../../domain/models/Quote';
import type { IApiClient } from '../api/ApiClient';

/**
 * Quote Service Interface - abstraction for quote operations
 */
export interface IQuoteService {
  requestQuotes(data: IQuoteRequest): Promise<IQuoteResponse>;
}

/**
 * QuoteServiceImpl - Implementation with injected ApiClient
 * Depends on IApiClient abstraction, not concrete implementation
 */
export class QuoteServiceImpl implements IQuoteService {
  private apiClient: IApiClient;

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Request shipping quotes from backend
   * @param data - Quote request data
   * @returns Promise with quotes and messages
   */
  async requestQuotes(data: IQuoteRequest): Promise<IQuoteResponse> {
    try {
      return await this.apiClient.post<IQuoteResponse>('/api/quotes', data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to request quotes: ${error.message}`);
      }
      throw new Error('Failed to request quotes: Unknown error');
    }
  }
}
