/**
 * Quote request interface matching backend API contract
 */
export interface IQuoteRequest {
  origin: string;
  destination: string;
  weight: number;
  pickupDate: string; 
  fragile: boolean;
}
