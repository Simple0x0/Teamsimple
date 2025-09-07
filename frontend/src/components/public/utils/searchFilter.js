// utils/searchFilter.js

/**
 * Filters an array of items based on search term and selected filters.
 * @param {Array} items - The array to filter.
 * @param {string} searchTerm - The search string (case-insensitive).
 * @param {Array<string>} selectedFilters - Array of selected filter strings.
 * @param {Array<string>} searchKeys - Keys of the object to search text in.
 * @param {Array<string>} filterKeys - Keys of the object to check filters against.
 * @returns {Array} - Filtered array.
 */
export const filterItems = (items, searchTerm, filters, searchKeys, filterKeys) => {
  if (!Array.isArray(items)) return [];
  return items.filter(item => {
    const matchesSearch = searchKeys.some(key => {
      const value = getNestedValue(item, key);
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    const matchesFilter =
      filters.length === 0 ||
      filters.some(filter =>
        filterKeys.some(key => {
          const value = getNestedValue(item, key);
          return value?.toLowerCase() === filter.toLowerCase();
        })
      );

    return matchesSearch && matchesFilter;
  });
};

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
};
