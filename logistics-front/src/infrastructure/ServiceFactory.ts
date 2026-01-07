/**
 * @file ServiceFactory.ts
 * @description Factory for creating and managing service dependencies
 * Implements Dependency Inversion Principle - centralized dependency resolution
 */

import { ApiClient } from './api/ApiClient';
import { QuoteServiceImpl } from './services/QuoteServiceImpl';
import type { IQuoteService } from './services/QuoteServiceImpl';
import type { IApiClient } from './api/ApiClient';

/**
 * ServiceFactory configuration
 */
export interface ServiceFactoryConfig {
  apiBaseURL: string;
  apiTimeout?: number;
}

/**
 * ServiceFactory - Centralized dependency resolution
 * Creates and wires up all services with their dependencies
 */
export class ServiceFactory {
  private static instance: ServiceFactory;
  private apiClient: IApiClient;
  private quoteService: IQuoteService;

  private constructor(config: ServiceFactoryConfig) {
    // Create ApiClient
    this.apiClient = new ApiClient({
      baseURL: config.apiBaseURL,
      timeout: config.apiTimeout,
    });

    // Create QuoteService with injected ApiClient
    this.quoteService = new QuoteServiceImpl(this.apiClient);
  }

  /**
   * Initialize factory with configuration (Singleton pattern)
   */
  static initialize(config: ServiceFactoryConfig): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory(config);
    }
    return ServiceFactory.instance;
  }

  /**
   * Get factory instance
   */
  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      throw new Error('ServiceFactory not initialized. Call initialize() first.');
    }
    return ServiceFactory.instance;
  }

  /**
   * Get QuoteService instance
   */
  getQuoteService(): IQuoteService {
    return this.quoteService;
  }

  /**
   * Get ApiClient instance (useful for testing)
   */
  getApiClient(): IApiClient {
    return this.apiClient;
  }

  /**
   * Reset factory (useful for testing)
   */
  static reset(): void {
    ServiceFactory.instance = undefined as unknown as ServiceFactory;
  }
}
