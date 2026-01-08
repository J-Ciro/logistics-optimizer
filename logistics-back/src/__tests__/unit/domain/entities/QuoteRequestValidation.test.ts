import { QuoteRequest, IQuoteRequestData } from '../../../../domain/entities/QuoteRequest';
import { ValidationError } from '../../../../domain/exceptions/ValidationError';

describe('QuoteRequest Entity - Validation', () => {
  const validData: IQuoteRequestData = {
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    weight: 5.5,
    pickupDate: new Date(Date.now() + 86400000), // Tomorrow
    fragile: false,
  };

  describe('Valid inputs', () => {
    test('should create QuoteRequest with all valid data', () => {
      const request = new QuoteRequest(validData);

      expect(request.origin).toBe('New York, NY');
      expect(request.destination).toBe('Los Angeles, CA');
      expect(request.weight).toBe(5.5);
      expect(request.pickupDate).toEqual(validData.pickupDate);
      expect(request.fragile).toBe(false);
    });

    test('should create QuoteRequest without fragile (defaults to false)', () => {
      const data = { ...validData };
      delete data.fragile;
      
      const request = new QuoteRequest(data);
      
      expect(request.fragile).toBe(false);
    });
  });

  describe('Weight validation', () => {
    test('should throw ValidationError when weight is 0', () => {
      const data = { ...validData, weight: 0 };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
      
      try {
        new QuoteRequest(data);
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).field).toBe('weight');
        expect((error as ValidationError).value).toBe(0);
        expect((error as ValidationError).message).toContain('0.1 kg');
      }
    });

    test('should throw ValidationError when weight is 0.099 (below minimum)', () => {
      const data = { ...validData, weight: 0.099 };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
      
      try {
        new QuoteRequest(data);
      } catch (error) {
        expect((error as ValidationError).field).toBe('weight');
        expect((error as ValidationError).value).toBe(0.099);
      }
    });

    test('should accept weight of 0.1 (minimum valid)', () => {
      const data = { ...validData, weight: 0.1 };
      
      expect(() => new QuoteRequest(data)).not.toThrow();
      const request = new QuoteRequest(data);
      expect(request.weight).toBe(0.1);
    });

    test('should accept weight of 1000 (maximum valid)', () => {
      const data = { ...validData, weight: 1000 };
      
      expect(() => new QuoteRequest(data)).not.toThrow();
      const request = new QuoteRequest(data);
      expect(request.weight).toBe(1000);
    });

    test('should throw ValidationError when weight exceeds 1000 kg', () => {
      const data = { ...validData, weight: 1000.001 };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
      
      try {
        new QuoteRequest(data);
      } catch (error) {
        expect((error as ValidationError).field).toBe('weight');
        expect((error as ValidationError).value).toBe(1000.001);
        expect((error as ValidationError).message).toContain('1000 kg');
      }
    });

    test('should throw ValidationError when weight is negative', () => {
      const data = { ...validData, weight: -5 };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });

    test('should throw ValidationError when weight is null', () => {
      const data = { ...validData, weight: null as any };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });

    test('should throw ValidationError when weight is undefined', () => {
      const data = { ...validData, weight: undefined as any };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });

    test('should throw ValidationError when weight is NaN', () => {
      const data = { ...validData, weight: NaN };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });

    test('should throw ValidationError when weight is Infinity', () => {
      const data = { ...validData, weight: Infinity };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });

    test('should throw ValidationError when weight is a string', () => {
      const data = { ...validData, weight: '5.5' as any };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });
  });

  describe('Pickup date validation', () => {
    test('should throw ValidationError when pickupDate is in the past', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const data = { ...validData, pickupDate: yesterday };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
      
      try {
        new QuoteRequest(data);
      } catch (error) {
        expect((error as ValidationError).field).toBe('pickupDate');
        expect((error as ValidationError).message).toContain('anterior');
      }
    });

    test('should accept pickupDate of today', () => {
      const today = new Date();
      const data = { ...validData, pickupDate: today };
      
      expect(() => new QuoteRequest(data)).not.toThrow();
    });

    test('should accept pickupDate 30 days from now (maximum valid)', () => {
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      const data = { ...validData, pickupDate: maxDate };
      
      expect(() => new QuoteRequest(data)).not.toThrow();
    });

    test('should throw ValidationError when pickupDate is more than 30 days away', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 31);
      const data = { ...validData, pickupDate: futureDate };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
      
      try {
        new QuoteRequest(data);
      } catch (error) {
        expect((error as ValidationError).field).toBe('pickupDate');
        expect((error as ValidationError).message).toContain('30 días');
      }
    });

    test('should throw ValidationError when pickupDate is null', () => {
      const data = { ...validData, pickupDate: null as any };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });

    test('should throw ValidationError when pickupDate is undefined', () => {
      const data = { ...validData, pickupDate: undefined as any };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });

    test('should throw ValidationError when pickupDate is invalid date', () => {
      const data = { ...validData, pickupDate: new Date('invalid') };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });
  });

  describe('Origin validation', () => {
    test('should throw ValidationError when origin is empty string', () => {
      const data = { ...validData, origin: '' };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
      
      try {
        new QuoteRequest(data);
      } catch (error) {
        expect((error as ValidationError).field).toBe('origin');
        expect((error as ValidationError).message).toContain('requerido');
      }
    });

    test('should throw ValidationError when origin is whitespace only', () => {
      const data = { ...validData, origin: '   ' };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });

    test('should throw ValidationError when origin is null', () => {
      const data = { ...validData, origin: null as any };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });

    test('should throw ValidationError when origin is undefined', () => {
      const data = { ...validData, origin: undefined as any };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });
  });

  describe('Destination validation', () => {
    test('should throw ValidationError when destination is empty string', () => {
      const data = { ...validData, destination: '' };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
      
      try {
        new QuoteRequest(data);
      } catch (error) {
        expect((error as ValidationError).field).toBe('destination');
        expect((error as ValidationError).message).toContain('requerido');
      }
    });

    test('should throw ValidationError when destination is whitespace only', () => {
      const data = { ...validData, destination: '   ' };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });

    test('should throw ValidationError when destination is null', () => {
      const data = { ...validData, destination: null as any };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });

    test('should throw ValidationError when destination is undefined', () => {
      const data = { ...validData, destination: undefined as any };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });
  });

  describe('Fragile validation', () => {
    test('should accept fragile as true', () => {
      const data = { ...validData, fragile: true };
      const request = new QuoteRequest(data);
      
      expect(request.fragile).toBe(true);
    });

    test('should accept fragile as false', () => {
      const data = { ...validData, fragile: false };
      const request = new QuoteRequest(data);
      
      expect(request.fragile).toBe(false);
    });

    test('should throw ValidationError when fragile is not a boolean', () => {
      const data = { ...validData, fragile: 'true' as any };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });

    test('should throw ValidationError when fragile is a number', () => {
      const data = { ...validData, fragile: 1 as any };

      expect(() => new QuoteRequest(data)).toThrow(ValidationError);
    });
  });
});
