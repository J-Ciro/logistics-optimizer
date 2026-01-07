import type { IProviderConfig, ProviderRegistryMap } from './ProviderRegistry';
import { ProviderRegistry, DEFAULT_PROVIDER_CONFIG } from './ProviderRegistry';

/**
 * Helper class for provider configuration access
 * Encapsulates logic for finding and accessing provider configurations
 */
export class ProviderConfigHelper {
  private registry: ProviderRegistryMap;

  constructor(registry: ProviderRegistryMap = ProviderRegistry) {
    this.registry = registry;
  }

  /**
   * Find provider configuration by ID (case-insensitive)
   */
  findProvider(providerId: string): IProviderConfig {
    const lowerProviderId = providerId.toLowerCase();

    // Try exact match first
    if (this.registry[lowerProviderId]) {
      return this.registry[lowerProviderId];
    }

    // Try partial match (contains)
    for (const [, config] of Object.entries(this.registry)) {
      if (lowerProviderId.includes(config.id) || config.id.includes(lowerProviderId)) {
        return config;
      }
    }

    // Return default if not found
    return DEFAULT_PROVIDER_CONFIG;
  }

  /**
   * Get color class for provider
   */
  getProviderColor(providerId: string): string {
    return this.findProvider(providerId).colorClass;
  }

  /**
   * Get all registered providers
   */
  getAllProviders(): IProviderConfig[] {
    return Object.values(this.registry);
  }

  /**
   * Check if provider is registered
   */
  isProviderRegistered(providerId: string): boolean {
    return this.findProvider(providerId).id !== 'unknown';
  }
}

/**
 * Default instance for global use
 */
export const defaultProviderHelper = new ProviderConfigHelper();
