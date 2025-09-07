export const filterByName = (items, term) => {
  if (!Array.isArray(items)) return [];
  return items.filter(item => item.name?.toLowerCase().includes(term.toLowerCase()));
};


