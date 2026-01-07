/**
 * @file ServiceFactory.spec.ts
 * @description Tests for ServiceFactory
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ServiceFactory } from '../ServiceFactory';

describe('ServiceFactory', () => {
  beforeEach(() => {
    ServiceFactory.reset();
  });

  afterEach(() => {
    ServiceFactory.reset();
  });

  describe('Initialization', () => {
    it('should initialize factory with configuration', () => {
      const factory = ServiceFactory.initialize({
        apiBaseURL: 'http://localhost:3000',
        apiTimeout: 5000,
      });

      expect(factory).toBeDefined();
      expect(factory.getQuoteService()).toBeDefined();
      expect(factory.getApiClient()).toBeDefined();
    });

    it('should return same instance on multiple initialize calls (Singleton)', () => {
      const factory1 = ServiceFactory.initialize({
        apiBaseURL: 'http://localhost:3000',
      });

      const factory2 = ServiceFactory.initialize({
        apiBaseURL: 'http://localhost:4000',
      });

      expect(factory1).toBe(factory2);
    });

    it('should throw error when getInstance called before initialize', () => {
      expect(() => ServiceFactory.getInstance()).toThrow(
        'ServiceFactory not initialized'
      );
    });
  });

  describe('Service retrieval', () => {
    it('should return QuoteService instance', () => {
      const factory = ServiceFactory.initialize({
        apiBaseURL: 'http://localhost:3000',
      });

      const quoteService = factory.getQuoteService();
      expect(quoteService).toBeDefined();
      expect(quoteService.requestQuotes).toBeDefined();
    });

    it('should return ApiClient instance', () => {
      const factory = ServiceFactory.initialize({
        apiBaseURL: 'http://localhost:3000',
      });

      const apiClient = factory.getApiClient();
      expect(apiClient).toBeDefined();
      expect(apiClient.get).toBeDefined();
      expect(apiClient.post).toBeDefined();
    });
  });

  describe('Reset', () => {
    it('should reset factory instance', () => {
      ServiceFactory.initialize({
        apiBaseURL: 'http://localhost:3000',
      });

      ServiceFactory.reset();

      expect(() => ServiceFactory.getInstance()).toThrow(
        'ServiceFactory not initialized'
      );
    });
  });
});
