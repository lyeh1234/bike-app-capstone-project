

export const numberFormat = (value) =>
  new Intl.NumberFormat( {
    maximumFractionDigits: 1
  }).format(value);