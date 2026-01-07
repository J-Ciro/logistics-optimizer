/**
 * @file ApiClient.spec.ts
 * @description Tests for ApiClient
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiClient } from '../ApiClient';

describe('ApiClient', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient({
      baseURL: 'http://localhost:3000',
      timeout: 5000,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { message: 'success' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiClient.get('/test');

      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/test',
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should throw error on failed GET request', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' }),
      });

      await expect(apiClient.get('/test')).rejects.toThrow('Not found');
    });

    it('should handle timeout on GET request', async () => {
      const shortTimeoutClient = new ApiClient({
        baseURL: 'http://localhost:3000',
        timeout: 10,
      });

      // Mock a slow fetch that will be aborted
      global.fetch = vi.fn().mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => {
              const error = new Error('The operation was aborted');
              error.name = 'AbortError';
              reject(error);
            }, 50);
          })
      );

      await expect(shortTimeoutClient.get('/test')).rejects.toThrow('Request timeout');
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const mockData = { id: 1, name: 'test' };
      const requestData = { name: 'test' };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiClient.post('/test', requestData);

      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/test',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        })
      );
    });

    it('should throw error on failed POST request', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Bad request' }),
      });

      await expect(apiClient.post('/test', {})).rejects.toThrow('Bad request');
    });

    it('should handle timeout on POST request', async () => {
      const shortTimeoutClient = new ApiClient({
        baseURL: 'http://localhost:3000',
        timeout: 10,
      });

      // Mock a slow fetch that will be aborted
      global.fetch = vi.fn().mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => {
              const error = new Error('The operation was aborted');
              error.name = 'AbortError';
              reject(error);
            }, 50);
          })
      );

      await expect(shortTimeoutClient.post('/test', {})).rejects.toThrow('Request timeout');
    });
  });

  describe('Error handling', () => {
    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(apiClient.get('/test')).rejects.toThrow('Network error');
    });

    it('should handle unknown errors', async () => {
      global.fetch = vi.fn().mockRejectedValue('Unknown error');

      await expect(apiClient.get('/test')).rejects.toThrow('An unknown error occurred');
    });
  });
});
