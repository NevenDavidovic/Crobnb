/**
 * Composable for price formatting and currency conversion utilities
 * Use this for consistent price formatting throughout the application
 */
export const usePriceFormatters = () => {
  /**
   * Converts a price from EUR to HRK
   * @param priceEUR Price in Euros
   * @returns The equivalent amount in Croatian Kuna
   */
  const convertToHRK = (priceEUR: number): number => {
    const conversionRate = 7.5345;
    const result = priceEUR * conversionRate;
    return result;
  };

  /**
   * Formats a price in EUR as a HRK string with currency symbol
   * @param priceEUR Price in Euros
   * @returns Formatted price string with HRK symbol
   */
  const formatPriceHRK = (priceEUR: number): string => {
    const priceHRK = convertToHRK(priceEUR);
    return `${priceHRK.toFixed(2)} HRK`;
  };

  /**
   * Formats a price as a EUR string with currency symbol
   * @param price Price in Euros
   * @returns Formatted price string with EUR symbol
   */
  const formatPrice = (price: number): string => {
    return `${price.toFixed(2)} EUR`;
  };

  /**
   * Calculates and formats the total price including taxes
   * @param basePrice Base price in EUR
   * @param nights Number of nights
   * @param taxRate Daily tax rate
   * @param guests Number of guests
   * @returns Formatted total price string in EUR
   */
  const calculateTotalPrice = (
    basePrice: number,
    nights: number = 1,
    taxRate: number = 0,
    guests: number = 1
  ): string => {
    const roomTotal = basePrice * nights;
    const taxTotal = taxRate * nights * guests;
    const total = roomTotal + taxTotal;

    return formatPrice(total);
  };

  /**
   * Calculates and formats the total price in HRK including taxes
   * @param basePrice Base price in EUR
   * @param nights Number of nights
   * @param taxRate Daily tax rate in HRK
   * @param guests Number of guests
   * @returns Formatted total price string in HRK
   */
  const calculateTotalPriceHRK = (
    basePrice: number,
    nights: number = 1,
    taxRate: number = 0,
    guests: number = 1
  ): string => {
    const roomTotal = basePrice * nights;
    const eurTaxTotal = (taxRate / 7.5345) * nights * guests;
    const totalEUR = roomTotal + eurTaxTotal;

    return formatPriceHRK(totalEUR);
  };

  return {
    convertToHRK,
    formatPriceHRK,
    formatPrice,
    calculateTotalPrice,
    calculateTotalPriceHRK,
  };
};
