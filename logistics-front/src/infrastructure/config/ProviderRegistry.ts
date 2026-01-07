/**
 * Provider Registry Configuration
 * Implements Open/Closed Principle - extensible without modifying existing code
 * Add new providers by extending this configuration, not by modifying component code
 */

import type { ReactNode } from 'react';

export interface IProviderConfig {
  id: string;
  name: string;
  logoUrl?: string;
  logoAlt: string;
  colorClass: string;
  isCustomLogo?: boolean;
  customLogoRender?: () => ReactNode;
}

export type ProviderRegistryMap = Record<string, IProviderConfig>;

/**
 * Provider registry configuration  
 * All provider-specific data is centralized here
 * To add a new provider, simply add an entry to this registry
 */
export const ProviderRegistry: ProviderRegistryMap = {
  dhl: {
    id: 'dhl',
    name: 'DHL',
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB82sGJRkCPxGE42o_z3KQKXYjsmp4b9yQVQ&s',
    logoAlt: 'DHL Logo',
    colorClass: 'bg-accent-info',
    isCustomLogo: false,
  },
  fedex: {
    id: 'fedex',
    name: 'FedEx',
    logoUrl: 'https://logos-world.net/wp-content/uploads/2020/04/FedEx-Logo.png',
    logoAlt: 'FedEx Logo',
    colorClass: 'bg-accent-purple',
    isCustomLogo: false,
  },
};

/**
 * Default provider config when provider is not found in registry
 */
export const DEFAULT_PROVIDER_CONFIG: IProviderConfig = {
  id: 'unknown',
  name: 'Unknown Provider',
  logoAlt: 'Unknown Provider',
  colorClass: 'bg-accent-purple',
  isCustomLogo: true,
};
