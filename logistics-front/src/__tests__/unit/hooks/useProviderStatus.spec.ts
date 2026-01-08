import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useProviderStatus } from '../../../hooks/useProviderStatus';

describe('useProviderStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  
    global.fetch = vi.fn(() => new Promise(() => {})) as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should auto-refresh every 30 seconds', async () => {
    vi.useFakeTimers();
    
    const mockResponse = {
      systemStatus: 'online',
      providers: [
        { name: 'DHL', status: 'online', responseTime: 120 }
      ]
    };

    let fetchCallCount = 0;
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(async () => {
      fetchCallCount++;
      return {
        ok: true,
        json: async () => mockResponse,
      };
    });

    renderHook(() => useProviderStatus());

    // Initial call
    expect(fetchCallCount).toBe(1);

    // Advance time by 30 seconds
    await vi.advanceTimersByTimeAsync(30000);

    // Should have called fetch again
    expect(fetchCallCount).toBeGreaterThan(1);
    
    vi.useRealTimers();
  }, 10000);


  it('should clear interval on unmount', async () => {
    vi.useFakeTimers();
    
    const mockResponse = {
      systemStatus: 'online',
      providers: []
    };

    let fetchCallCount = 0;
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(async () => {
      fetchCallCount++;
      return {
        ok: true,
        json: async () => mockResponse,
      };
    });

    const { unmount } = renderHook(() => useProviderStatus());

    const initialCallCount = fetchCallCount;

    unmount();

    // Advance time by 30 seconds after unmount
    await vi.advanceTimersByTimeAsync(30000);

    // Should not have called fetch again
    expect(fetchCallCount).toBe(initialCallCount);
    
    vi.useRealTimers();
  }, 10000);

});

