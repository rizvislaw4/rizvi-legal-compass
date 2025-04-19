
/**
 * Application currency configuration
 */
export const currencyConfig = {
  code: "PKR",
  symbol: "Rs",
  name: "Pakistani Rupee",
  format: (amount: number) => `${currencyConfig.symbol} ${amount.toLocaleString()}`,
  parse: (formattedAmount: string) => {
    // Remove currency symbol and commas, then parse as float
    return parseFloat(formattedAmount.replace(currencyConfig.symbol, '').trim().replace(/,/g, ''));
  }
};
