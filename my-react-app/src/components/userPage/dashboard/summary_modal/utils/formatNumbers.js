export const formatNumber = (number) => {
  if (number === undefined || number === null) return '0.00';
  const num = Number(number);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};