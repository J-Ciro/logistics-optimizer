import { describe, it, expect } from 'vitest';
import { ProviderRegistry } from '../../../infrastructure/config/ProviderRegistry';
import { ProviderConfigHelper } from '../../../infrastructure/config/ProviderConfigHelper';

describe('ProviderRegistry', () => {
  it('should have default providers registered', () => {
    expect(ProviderRegistry['dhl']).toBeDefined();
    expect(ProviderRegistry['fedex']).toBeDefined();
  });

  it('should have correct DHL configuration', () => {
    const dhl = ProviderRegistry['dhl'];
    expect(dhl.id).toBe('dhl');
    expect(dhl.name).toBe('DHL');
    expect(dhl.colorClass).toBe('bg-accent-info');
    expect(dhl.logoUrl).toBeDefined();
  });

  it('should have correct FedEx configuration', () => {
    const fedex = ProviderRegistry['fedex'];
    expect(fedex.id).toBe('fedex');
    expect(fedex.name).toBe('FedEx');
    expect(fedex.colorClass).toBe('bg-accent-purple');
    expect(fedex.logoUrl).toBeDefined();
  });
});

describe('ProviderConfigHelper', () => {
  const helper = new ProviderConfigHelper();

  describe('findProvider', () => {
    it('should find provider by exact ID match', () => {
      const provider = helper.findProvider('dhl');
      expect(provider.id).toBe('dhl');
    });

    it('should find provider by ID containing provider name', () => {
      const provider = helper.findProvider('DHL Express');
      expect(provider.id).toBe('dhl');
    });

    it('should find provider by case-insensitive match', () => {
      const provider = helper.findProvider('FEDEX');
      expect(provider.id).toBe('fedex');
    });

    it('should return default provider for unknown provider', () => {
      const provider = helper.findProvider('unknown-carrier');
      expect(provider.id).toBe('unknown');
    });
  });

  describe('getProviderColor', () => {
    it('should return correct color for DHL', () => {
      expect(helper.getProviderColor('dhl')).toBe('bg-accent-info');
    });

    it('should return correct color for FedEx', () => {
      expect(helper.getProviderColor('fedex')).toBe('bg-accent-purple');
    });

    it('should return default color for unknown provider', () => {
      expect(helper.getProviderColor('unknown')).toBe('bg-accent-purple');
    });
  });

  describe('getAllProviders', () => {
    it('should return all registered providers', () => {
      const providers = helper.getAllProviders();
      expect(providers.length).toBeGreaterThanOrEqual(2);
      expect(providers.map(p => p.id)).toContain('dhl');
      expect(providers.map(p => p.id)).toContain('fedex');
    });
  });

  describe('isProviderRegistered', () => {
    it('should return true for registered provider', () => {
      expect(helper.isProviderRegistered('dhl')).toBe(true);
    });

    it('should return false for unregistered provider', () => {
      expect(helper.isProviderRegistered('unknown-carrier')).toBe(false);
    });
  });
});
