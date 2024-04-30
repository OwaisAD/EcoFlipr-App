export const formatCurrencyDA = (num: number) => {
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK", // Currency code for Danish Kroner
    minimumFractionDigits: 0,
  }).format(num);
};
