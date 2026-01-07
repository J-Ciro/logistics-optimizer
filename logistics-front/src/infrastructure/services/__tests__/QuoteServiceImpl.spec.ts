/**
 * @file QuoteServiceImpl.spec.ts
 * @description Tests for QuoteServiceImpl
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuoteServiceImpl } from '../QuoteServiceImpl';
import type { IApiClient } from '../../api/ApiClient';
import type { IQuoteRequest } from '../../../domain/models/QuoteRequest';
import type { IQuoteResponse } from '../../../domain/models/Quote';

describe('QuoteServiceImpl', () => {
  let mockApiClient: IApiClient;
  let quoteService: QuoteServiceImpl;

  beforeEach(() => {
    mockApiClient = {
      get: vi.fn(),
      post: vi.fn(),
    };
    quoteService = new QuoteServiceImpl(mockApiClient);
  });

  describe('requestQuotes', () => {
    it('should request quotes successfully', async () => {
      const mockRequest: IQuoteRequest = {
        origin: 'San Francisco, CA',
        destination: 'New York, NY',
        weight: 10,
        pickupDate: '2026-01-15',
        fragile: false,
      };

      const mockResponse: IQuoteResponse = {
        quotes: [
          {
            providerId: 'dhl',
            providerName: 'DHL',
            price: 45.99,
            estimatedDays: 3,
            currency: 'USD',
          },
        ],
        messages: [],
      };

      vi.mocked(mockApiClient.post).mockResolvedValue(mockResponse);

      const result = await quoteService.requestQuotes(mockRequest);

      expect(result).toEqual(mockResponse);
      expect(mockApiClient.post).toHaveBeenCalledWith('/api/quotes', mockRequest);
    });

    it('should throw error on API failure', async () => {
      const mockRequest: IQuoteRequest = {
        origin: 'San Francisco, CA',
        destination: 'New York, NY',
        weight: 10,
        pickupDate: '2026-01-15',
        fragile: false,
      };

      vi.mocked(mockApiClient.post).mockRejectedValue(new Error('API Error'));

      await expect(quoteService.requestQuotes(mockRequest)).rejects.toThrow(
        'Failed to request quotes: API Error'
      );
    });

    it('should handle unknown errors', async () => {
      const mockRequest: IQuoteRequest = {
        origin: 'San Francisco, CA',
        destination: 'New York, NY',
        weight: 10,
        pickupDate: '2026-01-15',
        fragile: false,
      };

      vi.mocked(mockApiClient.post).mockRejectedValue('Unknown error');

      await expect(quoteService.requestQuotes(mockRequest)).rejects.toThrow(
        'Failed to request quotes: Unknown error'
      );
    });
  });
});
