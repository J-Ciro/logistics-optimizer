/**
 * Zone Configuration for Colombia Dynamic Pricing
 * Maps Colombian cities to shipping zones and provides zone-based multipliers per carrier
 */

export enum ZoneType {
  ZONE_1 = 'ZONE_1', // Bogotá y Región Central
  ZONE_2 = 'ZONE_2', // Medellín y Eje Cafetero
  ZONE_3 = 'ZONE_3', // Cali y Región Pacífico
  ZONE_4 = 'ZONE_4', // Barranquilla, Cartagena y Costa Caribe
  ZONE_5 = 'ZONE_5', // Zonas Remotas (Amazonas, Llanos, etc)
}

type ZoneMultipliers = Record<ZoneType, number>;

export class ZoneConfig {
  // Colombian cities to Zone mapping
  private static readonly CITY_TO_ZONE: Record<string, ZoneType> = {
    // Zone 1: Bogotá y Región Central (Cundinamarca, Boyacá, Meta)
    BOGOTA: ZoneType.ZONE_1,
    BOGOTÁ: ZoneType.ZONE_1,
    SOACHA: ZoneType.ZONE_1,
    ZIPAQUIRA: ZoneType.ZONE_1,
    ZIPAQUIRÁ: ZoneType.ZONE_1,
    FACATATIVA: ZoneType.ZONE_1,
    CHIA: ZoneType.ZONE_1,
    CHÍA: ZoneType.ZONE_1,
    TUNJA: ZoneType.ZONE_1,
    VILLAVICENCIO: ZoneType.ZONE_1,
    FUSAGASUGA: ZoneType.ZONE_1,
    FUSAGASUGÁ: ZoneType.ZONE_1,

    // Zone 2: Medellín y Eje Cafetero (Antioquia, Caldas, Risaralda, Quindío)
    MEDELLIN: ZoneType.ZONE_2,
    MEDELLÍN: ZoneType.ZONE_2,
    ENVIGADO: ZoneType.ZONE_2,
    ITAGUI: ZoneType.ZONE_2,
    ITAGÜI: ZoneType.ZONE_2,
    BELLO: ZoneType.ZONE_2,
    SABANETA: ZoneType.ZONE_2,
    RIONEGRO: ZoneType.ZONE_2,
    MANIZALES: ZoneType.ZONE_2,
    PEREIRA: ZoneType.ZONE_2,
    ARMENIA: ZoneType.ZONE_2,
    DOSQUEBRADAS: ZoneType.ZONE_2,

    // Zone 3: Cali y Región Pacífico (Valle del Cauca, Cauca, Nariño)
    CALI: ZoneType.ZONE_3,
    PALMIRA: ZoneType.ZONE_3,
    BUENAVENTURA: ZoneType.ZONE_3,
    TULUA: ZoneType.ZONE_3,
    TULUÁ: ZoneType.ZONE_3,
    POPAYAN: ZoneType.ZONE_3,
    POPAYÁN: ZoneType.ZONE_3,
    PASTO: ZoneType.ZONE_3,
    IPIALES: ZoneType.ZONE_3,

    // Zone 4: Costa Caribe (Atlántico, Bolívar, Magdalena, Cesar, Córdoba)
    BARRANQUILLA: ZoneType.ZONE_4,
    CARTAGENA: ZoneType.ZONE_4,
    'SANTA MARTA': ZoneType.ZONE_4,
    MONTERIA: ZoneType.ZONE_4,
    MONTERÍA: ZoneType.ZONE_4,
    VALLEDUPAR: ZoneType.ZONE_4,
    SINCELEJO: ZoneType.ZONE_4,
    SOLEDAD: ZoneType.ZONE_4,
    MALAMBO: ZoneType.ZONE_4,

    // Zone 5: Zonas Remotas (Amazonas, Guainía, Vaupés, Vichada, Guaviare)
    LETICIA: ZoneType.ZONE_5,
    PUERTO: ZoneType.ZONE_5,
    INIRIDA: ZoneType.ZONE_5,
    MITU: ZoneType.ZONE_5,
    MITÚ: ZoneType.ZONE_5,
    YOPAL: ZoneType.ZONE_5,
    ARAUCA: ZoneType.ZONE_5,
    MOCOA: ZoneType.ZONE_5,
    FLORENCIA: ZoneType.ZONE_5,
  };

  // Carrier-specific zone multipliers for Colombia
  private static readonly MULTIPLIERS: Record<string, ZoneMultipliers> = {
    FedEx: {
      [ZoneType.ZONE_1]: 1.0,
      [ZoneType.ZONE_2]: 1.15,
      [ZoneType.ZONE_3]: 1.25,
      [ZoneType.ZONE_4]: 1.35,
      [ZoneType.ZONE_5]: 1.6,
    },
    DHL: {
      [ZoneType.ZONE_1]: 1.0,
      [ZoneType.ZONE_2]: 1.1,
      [ZoneType.ZONE_3]: 1.2,
      [ZoneType.ZONE_4]: 1.3,
      [ZoneType.ZONE_5]: 1.5,
    },
    Local: {
      [ZoneType.ZONE_1]: 1.8,
      [ZoneType.ZONE_2]: 1.4,
      [ZoneType.ZONE_3]: 1.12,
      [ZoneType.ZONE_4]: 1.5,
      [ZoneType.ZONE_5]: 1.6,
    },
  };

  /**
   * Normalize string by removing accents and converting to uppercase
   */
  private static normalizeString(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .trim();
  }

  /**
   * Get zone by destination city name
   */
  static getZoneByDestination(destination: string): ZoneType {
    if (!destination || typeof destination !== 'string' || destination.trim() === '') {
      return ZoneType.ZONE_1;
    }

    const normalized = this.normalizeString(destination);

    // Check for exact match first
    if (this.CITY_TO_ZONE[normalized]) {
      return this.CITY_TO_ZONE[normalized];
    }

    // Check if destination contains any known city name
    for (const [city, zone] of Object.entries(this.CITY_TO_ZONE)) {
      if (normalized.includes(city)) {
        return zone;
      }
    }

    // Default to Zone 1 (Bogotá) if no match
    return ZoneType.ZONE_1;
  }

  /**
   * Get zone multipliers for a specific carrier
   */
  static getMultipliers(carrier: string): ZoneMultipliers {
    return this.MULTIPLIERS[carrier] || this.MULTIPLIERS.FedEx;
  }

  /**
   * Get multiplier for a specific carrier and zone
   */
  static getMultiplier(carrier: string, zone: ZoneType): number {
    const multipliers = this.getMultipliers(carrier);
    return multipliers[zone];
  }
}
