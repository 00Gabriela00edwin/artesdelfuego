export const unitlessCategories = new Set(['MATERIALES DE HORNO', 'HERRAMIENTAS']);

export const isUnitlessCategory = (categoryName) => Boolean(categoryName && unitlessCategories.has(categoryName));

export const getBaseUnit = (categoryName) => {
  if (isUnitlessCategory(categoryName)) return '';
  if (categoryName === 'DESFLOCULANTE' || categoryName === 'ESMALTES DE GRES') return 'ml';
  return 'g';
};

export const formatStock = (baseValue, categoryName) => {
  const value = Number(baseValue) || 0;

  if (isUnitlessCategory(categoryName)) {
    return String(Math.round(value));
  }

  if (categoryName === 'DESFLOCULANTE' || categoryName === 'ESMALTES DE GRES') {
    return value >= 1000 ? `${(value / 1000).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')} L` : `${Math.round(value)} ml`;
  }

  if (value >= 1000) return `${(value / 1000).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')} kg`;
  if (value >= 1) return `${Math.round(value)} g`;
  return `${Math.round(value * 1000)} mg`;
};
