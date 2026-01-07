import { ZoneConfig, ZoneType } from './ZoneConfig';

describe('ZoneConfig Colombia - RED Phase (Tests First)', () => {
  describe('Zone Lookup', () => {
    test('should return Zone 1 for Bogotá', () => {
      const zone = ZoneConfig.getZoneByDestination('Bogotá');
      expect(zone).toBe(ZoneType.ZONE_1);
    });

    test('should return Zone 2 for Medellín', () => {
      const zone = ZoneConfig.getZoneByDestination('Medellín');
      expect(zone).toBe(ZoneType.ZONE_2);
    });

    test('should return Zone 3 for Cali', () => {
      const zone = ZoneConfig.getZoneByDestination('Cali');
      expect(zone).toBe(ZoneType.ZONE_3);
    });

    test('should return Zone 4 for Barranquilla', () => {
      const zone = ZoneConfig.getZoneByDestination('Barranquilla');
      expect(zone).toBe(ZoneType.ZONE_4);
    });

    test('should return Zone 5 for Leticia', () => {
      const zone = ZoneConfig.getZoneByDestination('Leticia');
      expect(zone).toBe(ZoneType.ZONE_5);
    });

    test('should handle case-insensitive city names', () => {
      const zone1 = ZoneConfig.getZoneByDestination('bogota');
      const zone2 = ZoneConfig.getZoneByDestination('BOGOTÁ');
      const zone3 = ZoneConfig.getZoneByDestination('Bogotá');
      expect(zone1).toBe(ZoneType.ZONE_1);
      expect(zone2).toBe(ZoneType.ZONE_1);
      expect(zone3).toBe(ZoneType.ZONE_1);
    });

    test('should handle accents in city names', () => {
      const zone1 = ZoneConfig.getZoneByDestination('Medellin');
      const zone2 = ZoneConfig.getZoneByDestination('Medellín');
      expect(zone1).toBe(ZoneType.ZONE_2);
      expect(zone2).toBe(ZoneType.ZONE_2);
    });

    test('should return Zone 2 for Pereira (Eje Cafetero)', () => {
      const zone = ZoneConfig.getZoneByDestination('Pereira');
      expect(zone).toBe(ZoneType.ZONE_2);
    });

    test('should return Zone 4 for Cartagena', () => {
      const zone = ZoneConfig.getZoneByDestination('Cartagena');
      expect(zone).toBe(ZoneType.ZONE_4);
    });

    test('should return Zone 3 for Buenaventura', () => {
      const zone = ZoneConfig.getZoneByDestination('Buenaventura');
      expect(zone).toBe(ZoneType.ZONE_3);
    });

    test('should default to ZONE_1 for unknown cities', () => {
      const zone = ZoneConfig.getZoneByDestination('Ciudad Desconocida');
      expect(zone).toBe(ZoneType.ZONE_1);
    });
  });

  describe('Zone Multipliers', () => {
    test('FedEx should have different multipliers per zone', () => {
      const multipliers = ZoneConfig.getMultipliers('FedEx');
      expect(multipliers[ZoneType.ZONE_1]).toBe(1.0);
      expect(multipliers[ZoneType.ZONE_2]).toBe(1.15);
      expect(multipliers[ZoneType.ZONE_3]).toBe(1.25);
      expect(multipliers[ZoneType.ZONE_4]).toBe(1.35);
      expect(multipliers[ZoneType.ZONE_5]).toBe(1.6);
    });

    test('DHL should have different multipliers per zone', () => {
      const multipliers = ZoneConfig.getMultipliers('DHL');
      expect(multipliers[ZoneType.ZONE_1]).toBe(1.0);
      expect(multipliers[ZoneType.ZONE_2]).toBe(1.1);
      expect(multipliers[ZoneType.ZONE_3]).toBe(1.2);
      expect(multipliers[ZoneType.ZONE_4]).toBe(1.3);
      expect(multipliers[ZoneType.ZONE_5]).toBe(1.5);
    });

    test('Local should have dynamic multipliers per zone', () => {
      const multipliers = ZoneConfig.getMultipliers('Local');
      expect(multipliers[ZoneType.ZONE_1]).toBe(1.8);
      expect(multipliers[ZoneType.ZONE_2]).toBe(1.4);
      expect(multipliers[ZoneType.ZONE_3]).toBe(1.12);
      expect(multipliers[ZoneType.ZONE_4]).toBe(1.5);
      expect(multipliers[ZoneType.ZONE_5]).toBe(1.6);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty string destination', () => {
      const zone = ZoneConfig.getZoneByDestination('');
      expect(zone).toBe(ZoneType.ZONE_1);
    });

    test('should handle null destination', () => {
      const zone = ZoneConfig.getZoneByDestination(null as any);
      expect(zone).toBe(ZoneType.ZONE_1);
    });

    test('should handle whitespace-only destination', () => {
      const zone = ZoneConfig.getZoneByDestination('   ');
      expect(zone).toBe(ZoneType.ZONE_1);
    });
  });
});
