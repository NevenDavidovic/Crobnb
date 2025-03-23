export const usePriceFormatters = () => {
  const convertToHRK = (priceEUR: number): number => {
    const conversionRate = 7.5345;
    const result = priceEUR * conversionRate;
    return result;
  };

  const formatPriceHRK = (priceEUR: number): string => {
    const priceHRK = convertToHRK(priceEUR);
    return `${priceHRK.toFixed(2)} HRK`;
  };

  const formatPrice = (price: number): string => {
    return `${price.toFixed(2)} EUR`;
  };

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
