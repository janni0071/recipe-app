export interface IngredientItem {
  amount?: number;
  amountMax?: number;
  unit?: string;
  name: string;
}

export interface IngredientGroup {
  heading?: string;
  items: IngredientItem[];
}

export function formatAmount(amount?: number, amountMax?: number): string {
  if (amount == null) return '';
  return amountMax != null ? `${amount}-${amountMax}` : `${amount}`;
}

// French units like "g de" or elided "d'" need to hug the ingredient name
// without — or with exactly one — space; other locales just want one space.
export function unitAndName(unit: string | undefined, name: string): string {
  if (!unit) return name;
  return unit.endsWith("'") ? `${unit}${name}` : `${unit} ${name}`;
}

/** Renders one ingredient exactly as displayed on the recipe page, e.g. "100 g flour", "2-3 bell peppers", or just "parmesan" for items with no amount. */
export function formatIngredientText(item: IngredientItem): string {
  if (item.amount == null) return unitAndName(item.unit, item.name);
  return `${formatAmount(item.amount, item.amountMax)} ${unitAndName(item.unit, item.name)}`;
}
