/**
 * Checks if two categories are compatible for matching
 * Handles special case equivalences like shelter/housing
 * @param category1 First category to compare
 * @param category2 Second category to compare
 * @returns boolean indicating if categories are compatible
 */
export function categoriesMatch(category1: string | undefined | null, category2: string | undefined | null): boolean {
  // Handle null/undefined values
  if (!category1 || !category2) return false;
  
  try {
    // Normalize categories for comparison
    const normalized1 = String(category1).toLowerCase().trim();
    const normalized2 = String(category2).toLowerCase().trim();
    
    // Direct match
    if (normalized1 === normalized2) {
      return true;
    }
    
    // Special case for shelter/housing equivalence
    if ((normalized1 === 'shelter' && normalized2 === 'housing') || 
        (normalized1 === 'housing' && normalized2 === 'shelter')) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error comparing categories:", error);
    return false;
  }
}