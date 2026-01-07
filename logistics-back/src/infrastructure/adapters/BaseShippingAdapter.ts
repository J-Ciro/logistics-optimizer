import { IShippingProvider } from '../../domain/interfaces/IShippingProvider';
import { Quote } from '../../domain/entities/Quote';

/**
 * Base abstract class for shipping adapters
 * Implements common validation logic to avoid code duplication
 * Following DRY (Don't Repeat Yourself) principle
 */
export abstract class BaseShippingAdapter implements IShippingProvider {
  protected readonly MIN_WEIGHT = 0.1;
  protected readonly MAX_WEIGHT = 1000;

  /**
   * Validate weight and destination before calculating shipping
   * @param weight - Weight in kilograms
   * @param destination - Destination address
   * @throws Error if validation fails
   */
  protected validateShippingRequest(weight: number, destination: string): void {
    // Validate weight minimum
    if (weight < this.MIN_WEIGHT) {
      throw new Error(`Weight must be greater than ${this.MIN_WEIGHT} kg`);
    }

    // Validate weight maximum
    if (weight > this.MAX_WEIGHT) {
      throw new Error(`Weight must be less than or equal to ${this.MAX_WEIGHT} kg`);
    }

    // Validate destination is not empty
    if (!destination || destination.trim() === '') {
      throw new Error('Destination is required');
    }
  }

  /**
   * Calculate shipping cost and delivery time
   * Must be implemented by concrete adapter classes
   */
  abstract calculateShipping(weight: number, destination: string): Promise<Quote>;

}
